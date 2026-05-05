import { storyChapters } from './story';

export const books = [
  {
    id: 'baes-anatomy',
    title: "Bae's Anatomy",
    subtitle: 'A Birthday Month Story',
    label: 'Serialized fiction',
    description:
      'A private seventeen-part story told in daily chapters, built for quiet reading and easy return visits.',
    author: 'Lantern Reader',
    chapters: storyChapters,
    coverAccent: '#B98B4B',
    coverSecondary: '#6F8FA3',
    availability: 'available',
    releaseLabel: 'Daily release',
  },
  {
    id: 'after-hillpoint',
    title: 'After Hillpoint',
    subtitle: 'A story from the next shelf',
    label: 'Coming soon',
    description:
      'A future serialized story will appear here when it is ready for release.',
    author: 'Lantern Reader',
    chapters: [],
    coverAccent: '#6F8FA3',
    coverSecondary: '#B98B4B',
    availability: 'coming-soon',
    releaseLabel: 'Coming soon',
  },
  {
    id: 'the-velvet-file',
    title: 'The Velvet File',
    subtitle: 'A future private serial',
    label: 'Coming soon',
    description:
      'Another shelf slot reserved for a future Lantern Reader story collection.',
    author: 'Lantern Reader',
    chapters: [],
    coverAccent: '#9AAE8C',
    coverSecondary: '#C6A15B',
    availability: 'coming-soon',
    releaseLabel: 'Coming soon',
  },
];
