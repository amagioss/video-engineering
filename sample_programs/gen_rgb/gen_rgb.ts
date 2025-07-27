import { spawn } from "child_process";

type Point = {
    x: number;
    y: number;
}

let frame_num = 0

function generate_rgb_frame(w: number, h: number, p: Point, direction: Point): [Buffer, Point, Point] {
    const buf = Buffer.alloc(w*h*3);

    // Memset allocated buffer to 0
    buf.fill(0);

    frame_num++;

    const min_w_h = (w < h) ? w : h;
    const box_w = Math.floor(min_w_h * 0.25);

    const xpos = Math.floor(p.x);
    const ypos = Math.floor(p.y);

    let xdir = direction.x;
    let ydir = direction.y;

    const step_size = 10;

    let new_xpos = xpos + xdir * step_size;
    let new_ypos = ypos + ydir * step_size;

    
    if (new_xpos < 0 || (new_xpos + box_w) > w) {
        xdir = -xdir;
        new_xpos = new_xpos < 0 ? 0 : w - box_w;
    }

    if (new_ypos < 0 || (new_ypos + box_w) > h) {
        ydir = -ydir;
        xdir += Math.sign(xdir) * Math.random();
        ydir += Math.sign(ydir) * Math.random();
        xdir = xdir / Math.sqrt(xdir*xdir + ydir*ydir);
        ydir = ydir / Math.sqrt(xdir*xdir + ydir*ydir);
        new_ypos = new_ypos < 0 ? 0 : h - box_w;
    }

    for(let y = Math.floor(new_ypos); y < Math.floor(new_ypos) + box_w; y++) {
        for(let x = Math.floor(new_xpos); x < Math.floor(new_xpos) + box_w; x++) {
            const pixel_index = (y * w + x) * 3;
            buf[pixel_index] = 255;
            buf[pixel_index + 1] = 0;
            buf[pixel_index + 2] = 0;
        }
    }

    return [buf, {x: new_xpos, y: new_ypos}, {x: xdir, y: ydir}];
}

// Check if ffplay is available
console.log('Starting ffplay...');

// Spawn ffplay process
const ffplay = spawn('ffplay', 
    ['-f', 'rawvideo', '-pixel_format', 'rgb24',
         '-video_size', '1280x720', '-framerate', '30', '-i', '-']);

// Handle ffplay errors
ffplay.on('error', (err) => {
    console.error('Failed to start ffplay:', err.message);
    console.error('Make sure ffplay (part of FFmpeg) is installed and in your PATH');
    process.exit(1);
});

/*ffplay.stderr.on('data', (data) => {
    console.error('ffplay stderr:', data.toString());
});*/

ffplay.on('close', (code) => {
    console.log(`ffplay process exited with code ${code}`);
    process.exit(0);
});

// Initialize position and direction
let currentPos = {x: 320, y: 400};
let currentDirection = {x: 1/Math.sqrt(2), y: 1/Math.sqrt(2)};

const intervalId = setInterval(() => {
    const [buf, newPos, newDirection] = generate_rgb_frame(1280, 720, currentPos, currentDirection);
    
    // Update position and direction for next frame
    currentPos = newPos;
    currentDirection = newDirection;
    
    if (ffplay.stdin.writable) {
        ffplay.stdin.write(buf);
    } else {
        console.log('ffplay stdin not writable, stopping...');
        clearInterval(intervalId);
    }
}, 1000/30);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nStopping...');
    clearInterval(intervalId);
    ffplay.kill();
    process.exit(0);
});