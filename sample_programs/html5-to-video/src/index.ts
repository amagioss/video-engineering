#!/usr/bin/env node

import { program } from 'commander';
import puppeteer, { Browser, Page, CDPSession } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

interface ConversionOptions {
  input: string;
  output?: string;
  width?: number;
  height?: number;
  duration?: number;
  fps?: number;
}

class HTML5ToVideoConverter {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private cdpSession: CDPSession | null = null;

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--enable-gpu',
        '--use-gl=desktop',
        '--enable-accelerated-2d-canvas',
        '--enable-accelerated-video-decode',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-background-networking',
        '--disable-web-security',
        '--run-all-compositor-stages-before-draw',
        '--disable-frame-rate-limit',
        '--max-gum-fps=60',
        '--force-gpu-rasterization',
        // Additional performance optimizations for screenshots
        '--disable-logging',
        '--disable-gpu-sandbox',
        '--disable-software-rasterizer',
        '--enable-fast-unload',
        '--enable-aggressive-domstorage-flushing',
        '--memory-pressure-off',
        '--max_old_space_size=4096',
        '--disable-background-mode',
        '--disable-plugins-discovery',
        '--disable-prerender-local-predictor'
      ]
    });
  }

  async convertHTMLToVideo(options: ConversionOptions): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const { input, output } = options;
    const width = options.width || 1280;
    const height = options.height || 720;
    const duration = options.duration || 10;
    const fps = options.fps || 30;

    // Validate input file
    if (!fs.existsSync(input)) {
      throw new Error(`Input file not found: ${input}`);
    }

    // Generate output filename if not provided
    const outputFile = output || this.generateOutputFilename(input);

    console.log(`Converting ${input} to ${outputFile}...`);
    console.log(`Resolution: ${width}x${height}, Duration: ${duration}s, FPS: ${fps}`);

    // Create a new page with specified viewport and performance optimizations
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width, height });
    
    // Performance optimizations for page
    await this.page.setBypassCSP(true);
    await this.page.setCacheEnabled(false);
    await this.page.evaluateOnNewDocument(() => {
      // Disable some features that might slow down rendering
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // Enable CDP for direct frame capture
    this.cdpSession = await this.page.target().createCDPSession();
    await this.cdpSession.send('Runtime.enable');
    await this.cdpSession.send('Page.enable');

    try {
      // Load the HTML file
      const htmlPath = path.resolve(input);
      const fileUrl = `file://${htmlPath}`;
      
      console.log(`Loading HTML file: ${fileUrl}`);
      await this.page.goto(fileUrl, { waitUntil: 'networkidle0' });

      // Wait for any animations or dynamic content to load - reduced for speed
      await this.page.waitForTimeout(500);

      // Use screenshot method for true alpha preservation
      console.log('Starting screenshot capture with true alpha preservation...');
      await this.captureWithSlowBrowser(outputFile, width, height, duration, fps);

      // Close the page
      await this.cdpSession.detach();
      await this.page.close();
      this.page = null;
      this.cdpSession = null;

      console.log(`✅ ARGB video conversion completed: ${outputFile}`);

    } catch (error) {
      if (this.cdpSession) {
        await this.cdpSession.detach();
        this.cdpSession = null;
      }
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      throw error;
    }
  }

  private async captureUsingScreencast(outputFile: string, width: number, height: number, duration: number, fps: number): Promise<void> {
    if (!this.page || !this.cdpSession) {
      throw new Error('Page or CDP session not available');
    }

    const totalFrames = duration * fps;
    const frameInterval = 1000 / fps; // milliseconds between frames

    console.log(`Capturing ${totalFrames} frames at ${fps} FPS using Chrome screencast...`);
    console.log(`Target frame interval: ${frameInterval.toFixed(2)}ms`);

    // Start ffmpeg process with raw RGBA input
    const ffmpeg = this.startFFmpegProcess(outputFile, width, height, fps);

    const frameTimings: number[] = [];
    const captureStartTime = Date.now();
    let frameCount = 0;
    let lastFrameTime = captureStartTime;
    let nextFrameTime = captureStartTime;
    
    // Frame buffering for precise timing
    const frameBuffer: Array<{ data: Buffer, timestamp: number }> = [];
    let isProcessingFrames = false;

    try {
      // Set up screencast listener with frame rate control
      this.cdpSession.on('Page.screencastFrame', async (frame: any) => {
        const frameReceiveTime = Date.now();
        
        console.log(`Frame received at ${frameReceiveTime}`);

        try {
          // Acknowledge the frame first
          await this.cdpSession!.send('Page.screencastFrameAck', { sessionId: frame.sessionId });

          // Convert base64 to RGBA buffer
          const imageBuffer = Buffer.from(frame.data, 'base64');
          
          // Use sharp for fast conversion if available
          let rgbaBuffer: Buffer;
          try {
            const sharp = require('sharp');
            rgbaBuffer = await sharp(imageBuffer)
              .ensureAlpha()
              .raw()
              .toBuffer();
          } catch {
            // Fallback: decode in browser
            const rgbaData = await this.page!.evaluate((base64Data: string, w: number, h: number) => {
              return new Promise<number[]>((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = w;
                canvas.height = h;

                const img = new Image();
                img.onload = () => {
                  ctx.drawImage(img, 0, 0);
                  const imageData = ctx.getImageData(0, 0, w, h);
                  resolve(Array.from(imageData.data));
                };
                img.src = 'data:image/png;base64,' + base64Data;
              });
            }, frame.data, width, height);
            rgbaBuffer = Buffer.from(rgbaData);
          }

          // Add frame to buffer with timestamp
          frameBuffer.push({ data: rgbaBuffer, timestamp: frameReceiveTime });
          
          // Keep buffer manageable without disrupting timing
          if (frameBuffer.length > 8) {
            // Remove oldest frames to prevent memory buildup while keeping recent frames
            frameBuffer.splice(0, frameBuffer.length - 6);
            console.warn(`⚠️  Frame buffer overflow: ${frameBuffer.length + (frameBuffer.length - 6)} frames queued. Dropped older frames to maintain timing.`);
          }

        } catch (error) {
          console.error('Frame processing error:', error);
        }
      });

      // Start screencast with conservative FPS matching
      const captureEveryNthFrame = Math.max(2, Math.round(90 / fps)); // Conservative throttling for smooth playback
      await this.cdpSession.send('Page.startScreencast', {
        format: 'png', // PNG format for alpha channel preservation
        quality: 80, // Higher quality for smoother video
        maxWidth: width,
        maxHeight: height,
        everyNthFrame: captureEveryNthFrame // Throttle capture to prevent jitter
      });
      
      console.log(`Chrome capture throttling: capturing every ${captureEveryNthFrame} frame(s) to match ${fps} FPS target`);

      // Precise frame timing processor
      const processFrames = async () => {
        if (isProcessingFrames) return;
        isProcessingFrames = true;

        while (frameCount < totalFrames && frameBuffer.length > 0) {
          const currentTime = Date.now();
          
          // Check if it's time for the next frame
          if (currentTime >= nextFrameTime) {
            const frameStartTime = Date.now();
            
            // Get and remove the most recent frame from buffer
            const frameData = frameBuffer.pop()!;
            
            // Write to ffmpeg
            if (ffmpeg.stdin && !ffmpeg.stdin.destroyed) {
              ffmpeg.stdin.write(frameData.data);
              frameCount++;
              
              const frameEndTime = Date.now();
              const frameDuration = frameEndTime - frameStartTime;
              const actualInterval = frameStartTime - lastFrameTime;
              const timingError = Math.abs(actualInterval - frameInterval);
              
              frameTimings.push(frameDuration);
              
              // Log timing info with precision metrics
              if (frameCount % 30 === 0 || frameCount <= 5) {
                console.log(`Frame ${frameCount}: process=${frameDuration}ms, interval=${actualInterval.toFixed(2)}ms, target=${frameInterval.toFixed(2)}ms, error=${timingError.toFixed(2)}ms`);
              }

              // Progress indicator
              if (frameCount % Math.floor(totalFrames / 10) === 0) {
                const recentFrames = frameTimings.slice(-30);
                const avgFrameDuration = recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length;
                const recentTimingErrors = [];
                for (let i = Math.max(0, frameTimings.length - 30); i < frameTimings.length - 1; i++) {
                  const expectedTime = captureStartTime + (i * frameInterval);
                  const actualTime = captureStartTime + (i * actualInterval);
                  recentTimingErrors.push(Math.abs(actualTime - expectedTime));
                }
                const avgTimingError = recentTimingErrors.length > 0 ? 
                  recentTimingErrors.reduce((a, b) => a + b, 0) / recentTimingErrors.length : 0;
                
                console.log(`Progress: ${Math.round((frameCount / totalFrames) * 100)}% (avg: ${avgFrameDuration.toFixed(2)}ms, timing error: ${avgTimingError.toFixed(2)}ms)`);
              }

              lastFrameTime = frameStartTime;
              nextFrameTime = captureStartTime + (frameCount * frameInterval);
            }
          }
          
          // Small delay to prevent busy waiting
          await new Promise(resolve => setTimeout(resolve, 1));
        }

        isProcessingFrames = false;
      };

      // Start the frame processor
      const frameProcessor = setInterval(processFrames, 5); // Check every 5ms

      // Wait for all frames to be captured
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Capture timeout')), (duration + 10) * 1000);
      });

      const capturePromise = new Promise<void>((resolve) => {
        const checkComplete = () => {
          if (frameCount >= totalFrames) {
            clearInterval(frameProcessor);
            resolve();
          } else {
            setTimeout(checkComplete, 100);
          }
        };
        checkComplete();
      });

      await Promise.race([capturePromise, timeoutPromise]);

      // Stop screencast
      await this.cdpSession.send('Page.stopScreencast');
      clearInterval(frameProcessor);

      // Close ffmpeg stdin to signal end of input
      if (ffmpeg.stdin) {
        ffmpeg.stdin.end();
      }

      // Wait for ffmpeg to finish
      await this.waitForFFmpegCompletion(ffmpeg);

      // Log final timing statistics
      const totalCaptureTime = Date.now() - captureStartTime;
      const avgFrameDuration = frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length;
      const maxFrameDuration = Math.max(...frameTimings);
      const minFrameDuration = Math.min(...frameTimings);

      // Calculate timing precision
      const expectedTotalTime = totalFrames * frameInterval;
      const timingPrecision = Math.abs(totalCaptureTime - expectedTotalTime);
      const avgActualInterval = totalCaptureTime / totalFrames;

      console.log(`\n📊 Precise Screencast Capture Statistics:`);
      console.log(`Total capture time: ${(totalCaptureTime / 1000).toFixed(2)}s (expected: ${(expectedTotalTime / 1000).toFixed(2)}s)`);
      console.log(`Frames captured: ${frameCount}/${totalFrames}`);
      console.log(`Average frame processing: ${avgFrameDuration.toFixed(2)}ms`);
      console.log(`Min/Max frame duration: ${minFrameDuration.toFixed(2)}ms / ${maxFrameDuration.toFixed(2)}ms`);
      console.log(`Target frame interval: ${frameInterval.toFixed(2)}ms`);
      console.log(`Actual average interval: ${avgActualInterval.toFixed(2)}ms`);
      console.log(`Timing precision: ${timingPrecision.toFixed(2)}ms (${((timingPrecision / expectedTotalTime) * 100).toFixed(2)}% error)`);
      console.log(`Actual capture rate: ${(frameCount / (totalCaptureTime / 1000)).toFixed(2)} FPS (target: ${fps} FPS)`);

    } catch (error) {
      // Kill ffmpeg process if still running
      if (!ffmpeg.killed) {
        ffmpeg.kill('SIGTERM');
      }
      throw error;
    }
  }

  private startFFmpegProcess(outputFile: string, width: number, height: number, fps: number): ChildProcess {
    console.log('Starting FFmpeg process for direct RGBA input...');
    
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'rawvideo',
      '-pixel_format', 'rgba',
      '-video_size', `${width}x${height}`,
      '-framerate', fps.toString(),
      '-i', 'pipe:0', // Read from stdin
      '-c:v', 'prores_ks',
      '-profile:v', '4444',
      '-pix_fmt', 'yuva444p10le',
      '-preset', 'ultrafast', // Fastest encoding preset
      '-tune', 'fastdecode', // Optimize for fast decoding
      '-threads', '0', // Use all available CPU cores
      '-thread_type', 'frame+slice', // Enable both frame and slice threading
      '-slices', '8', // Use multiple slices for parallel encoding
      '-y', // Overwrite output file
      outputFile
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    ffmpeg.stderr.on('data', (data: Buffer) => {
      const output = data.toString();
      if (output.includes('frame=') || output.includes('time=')) {
        process.stdout.write('\r' + output.split('\n').pop()?.trim() || '');
      }
    });

    ffmpeg.on('error', (error: Error) => {
      console.error(`FFmpeg error: ${error.message}`);
    });

    return ffmpeg;
  }

  private async waitForFFmpegCompletion(ffmpeg: ChildProcess): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg.on('close', (code: number) => {
        console.log(''); // New line after progress
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ffmpeg exited with code ${code}`));
        }
      });
    });
  }

  private generateOutputFilename(inputFile: string): string {
    const parsed = path.parse(inputFile);
    return path.join(parsed.dir, `${parsed.name}.mov`);
  }

  // Alternative method: Slow down browser to match target FPS
  private async captureWithSlowBrowser(outputFile: string, width: number, height: number, duration: number, fps: number): Promise<void> {
    if (!this.page || !this.cdpSession) {
      throw new Error('Page or CDP session not available');
    }

    console.log(`Optimizing browser for precise ${fps} FPS capture...`);
    
    // Don't throttle CPU - let browser run at normal speed
    // We'll control timing precisely instead
    
    const totalFrames = duration * fps;
    const frameInterval = 1000 / fps;

    console.log(`Capturing ${totalFrames} frames at precise ${fps} FPS intervals...`);

    const ffmpeg = this.startFFmpegProcess(outputFile, width, height, fps);
    const frameTimings: number[] = [];
    const captureStartTime = Date.now();

    try {
      const startTime = Date.now();
      let cumulativeProcessingTime = 0; // Track total processing time to compensate
      
      // Pre-allocate buffer for better memory performance
      const expectedBufferSize = width * height * 4; // RGBA = 4 bytes per pixel
      
      for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
        // Calculate exact time when this frame should be captured, compensating for processing delays
        const targetTime = startTime + (frameNum * frameInterval) + cumulativeProcessingTime;
        const currentTime = Date.now();
        
        // Wait until it's time for this frame
        const waitTime = targetTime - currentTime;
        if (waitTime > 0) {
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        const frameStartTime = Date.now();
        
        // Take optimized screenshot with alpha preservation - optimized for speed
        const screenshot = await this.page.screenshot({
          type: 'png',
          omitBackground: true,
          fullPage: false,
          encoding: 'binary',
          clip: { x: 0, y: 0, width: width, height: height }
        }) as Buffer;
        
        const screenshotEndTime = Date.now();
        const screenshotTime = screenshotEndTime - frameStartTime;

        // Ultra-fast Sharp conversion to RGBA - optimized for speed
        let rgbaBuffer: Buffer;
        try {
          const sharp = require('sharp');
          rgbaBuffer = await sharp(screenshot, { 
            failOnError: false,
            unlimited: true,
            sequentialRead: true,
            pages: 1, // Only process first page for speed
            density: 72, // Lower DPI for speed
          })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: false });
        } catch {
          // Browser fallback - optimized for speed
          const rgbaData = await this.page.evaluate((pngBase64: string, w: number, h: number) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { 
              alpha: true,
              willReadFrequently: true,
              desynchronized: true 
            }) as CanvasRenderingContext2D;
            canvas.width = w;
            canvas.height = h;

            return new Promise<Uint8ClampedArray>((resolve) => {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, w, h);
                resolve(imageData.data); // Return Uint8ClampedArray directly
              };
              img.src = 'data:image/png;base64,' + pngBase64;
            });
          }, screenshot.toString('base64'), width, height);
          rgbaBuffer = Buffer.from(rgbaData);
        }

        // Write directly to ffmpeg
        if (ffmpeg.stdin && !ffmpeg.stdin.destroyed) {
          ffmpeg.stdin.write(rgbaBuffer);
        }

        const frameEndTime = Date.now();
        const frameDuration = frameEndTime - frameStartTime;
        const rgbaConversionTime = frameEndTime - screenshotEndTime;
        const totalProcessingTime = frameDuration;
        
        // Update cumulative processing time to compensate for delays - more aggressive
        const frameOverhead = totalProcessingTime - frameInterval;
        if (frameOverhead > 0) {
          // More aggressive compensation: catch up faster when behind
          const compensationFactor = frameOverhead > frameInterval ? 0.8 : 0.6;
          cumulativeProcessingTime += frameOverhead * compensationFactor;
        }
        
        const actualInterval = frameStartTime - startTime - (frameNum * frameInterval);
        frameTimings.push(frameDuration);

        if (frameNum % 90 === 0 || frameNum < 2) {
          console.log(`Frame ${frameNum}: capture=${frameDuration}ms (screenshot=${screenshotTime}ms, rgba=${rgbaConversionTime}ms), compensation=${cumulativeProcessingTime.toFixed(1)}ms, timing=${Math.abs(actualInterval).toFixed(1)}ms off target`);
        }

        // Progress indicator - less frequent for speed
        if (frameNum % Math.floor(totalFrames / 5) === 0 && frameNum > 0) {
          const progress = Math.round((frameNum / totalFrames) * 100);
          const currentRate = frameNum / ((Date.now() - startTime) / 1000);
          console.log(`Progress: ${progress}% (${frameNum}/${totalFrames} frames, rate: ${currentRate.toFixed(1)} FPS)`);
        }
      }



      if (ffmpeg.stdin) {
        ffmpeg.stdin.end();
      }

      await this.waitForFFmpegCompletion(ffmpeg);

      const totalTime = Date.now() - captureStartTime;
      const avgDuration = frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length;
      
      console.log(`\n📊 Precise Timing Screenshot Capture:`);
      console.log(`Total time: ${(totalTime / 1000).toFixed(2)}s`);
      console.log(`Average frame capture: ${avgDuration.toFixed(2)}ms`);
      console.log(`Actual rate: ${(totalFrames / (totalTime / 1000)).toFixed(2)} FPS`);

    } catch (error) {
      // Cleanup on error
      if (!ffmpeg.killed) {
        ffmpeg.kill('SIGTERM');
      }
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.cdpSession) {
      try {
        await this.cdpSession.detach();
      } catch {}
      this.cdpSession = null;
    }
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

async function main() {
  program
    .name('html5-to-video')
    .description('Convert HTML5 files to ARGB MOV video format with alpha channel support')
    .version('2.0.0')
    .argument('<input>', 'Input HTML file path')
    .option('-o, --output <path>', 'Output video file path')
    .option('-w, --width <number>', 'Video width', '1280')
    .option('-h, --height <number>', 'Video height', '720')
    .option('-d, --duration <number>', 'Recording duration in seconds', '10')
    .option('-f, --fps <number>', 'Frames per second', '30')
    .action(async (input: string, options: any) => {
      const converter = new HTML5ToVideoConverter();
      
      try {
        await converter.initialize();
        
        console.log('Starting conversion...', options);

        const conversionOptions: ConversionOptions = {
          input,
          output: options.output,
          width: parseInt(options.width),
          height: parseInt(options.height),
          duration: parseInt(options.duration),
          fps: parseInt(options.fps)
        };

        await converter.convertHTMLToVideo(conversionOptions);
        
      } catch (error) {
        console.error('❌ Conversion failed:', error instanceof Error ? error.message : error);
        process.exit(1);
      } finally {
        await converter.cleanup();
      }
    });

  await program.parseAsync();
}

// Handle uncaught errors
process.on('uncaughtException', async (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', async (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

if (require.main === module) {
  main().catch(console.error);
}

export { HTML5ToVideoConverter }; 