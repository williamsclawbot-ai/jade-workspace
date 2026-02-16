import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '2nd Brain - Knowledge Base',
  description: 'Personal knowledge management and document storage',
  icons: {
    icon: '🧠',
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
