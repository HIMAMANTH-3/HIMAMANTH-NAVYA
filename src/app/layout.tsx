import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Best Friend Day 🎉 | A Special Gift For You',
  description: 'A luxurious, cinematic 3D Best Friend Day experience crafted with love — because some people deserve the whole world.',
  keywords: ['best friend day', 'best friend', 'friendship', 'special', 'june 8', 'celebration'],
  openGraph: {
    title: 'Happy Best Friend Day 🎉',
    description: 'A special Best Friend Day experience crafted with love, just for you.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0d0221" />
      </head>
      <body className="bg-[#0d0221] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
