import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';


const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro-human',
    'intro-gpt',
    {
      type: 'category',
      label: 'Setup',
      items: [
        'setup/setup',
        'setup/test_content',
      ],
    },
    {
      type: 'category',
      label: 'Multimedia Basics',
      items: [
        'basics/goals',
        'basics/introduction_to_multimedia',
        'basics/color_space',
        'basics/ffmpeg_commands',
        'basics/ntsc_pal_stories',
        'basics/assignments',
      ],
    },
    {
      type: 'category',
      label: 'Compression',
      items: [
        'compression/video_Compression',
        'compression/audio_compression',
        'compression/ffmpeg_commands',
        'compression/assignments',
        'advanced/codecs',
        'advanced/packetization',
      ],
    },
    {
      type: 'category',
      label: 'Video Containers',
      items: [
        'containers/intro',
        'containers/mpegts-presentation',
        'containers/mp4-format',
      ],
    },
    {
      type: 'category',
      label: 'FFMPEG',
      items: [
        'ffmpeg/intro',
      ],
    },
    {
      type: 'category',
      label: 'Streaming',
      items: [
        'streaming/intro',
      ],
    },
    {
      type: 'html',
      value:
        '<span style="border-top: 1px solid var(--ifm-color-gray-500); display: block; margin: 0.5rem 0.5rem 0.25rem 1rem;" />',
    },
    'course',
  ],
};

export default sidebars;
