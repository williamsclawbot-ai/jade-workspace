import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jade Workspace - Mission Control + 2nd Brain',
  description: 'Unified dashboard for project management and knowledge base',
  icons: {
    icon: '🎯',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-jade-cream text-jade-purple">
        {children}
      </body>
    </html>
  );
}
