import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feely - User feedbacks get real by being rewarded',
  description:
    "Feely is a spot where user thoughts become a treasure. More than giving users a voice: it's encouraging them to listen to each other, through conversations and rewarding. The result? A product actually built for your people. And they will feel part of it.",
  keywords: [
    'Feely',
    'User Feedbacks',
    'Feedback Boards',
    'Public roadmap',
    'Community',
  ],
  metadataBase: new URL('https://www.app.feely.so'),
  alternates: {
    canonical: 'https://www.app.feely.so',
  },
  openGraph: {
    title: 'Feely - User feedbacks get real by being rewarded',
    description:
      "Feely is a spot where user thoughts become a treasure. More than giving users a voice: it's encouraging them to listen to each other, through conversations and rewarding. The result? A product actually built for your people. And they will feel part of it.",
    url: 'https://www.app.feely.so',
    siteName: 'Feely',
    images: [
      {
        url: 'https://www.app.feely.so/assets/og.png',
        width: 800,
        height: 600,
      },
      {
        url: 'https://wwww.app.feely.so/assets/og-alt.png',
        width: 1800,
        height: 1600,
        alt: "Feely is a spot where user thoughts become a treasure. More than giving users a voice: it's encouraging them to listen to each other, through conversations and rewarding. The result? A product actually built for your people. And they will feel part of it.",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: 'Feely - User feedbacks get real by being rewarded',
    description:
      "Feely is a spot where user thoughts become a treasure. More than giving users a voice: it's encouraging them to listen to each other, through conversations and rewarding. The result? A product actually built for your people. And they will feel part of it.",
    card: 'summary_large_image',
    images: [
      {
        url: 'https://www.app.feely.so/assets/twitter-og.png',
        alt: 'Feely Logo',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};
