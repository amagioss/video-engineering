import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';


const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro-gpt',
    'intro-human',
    {
      type: 'category',
      label: 'Multimedia Basics',
      items: [
        {
          type: 'category',
          label: 'Introduction To Multimedia',
          link: {type: 'doc', id: 'basics/introduction_to_multimedia'},
          items: ['basics/color_space'],
        },
        'basics/resolution',
        'basics/frame_rates',
        'basics/interlaced',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/video_compression',
        'advanced/audio_compression',
        'advanced/codecs',
        'advanced/packetization',
        'advanced/mpeg_ts',
      ],
    },
    {
      type: 'category',
      label: 'Video Containers',
      items: [
        'containers/intro',
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
  ],
};

export default sidebars;
