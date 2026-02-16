import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jade Workspace - Unified Control Center',
  description: 'Unified workspace with sidebar navigation for project management, tasks, content, and knowledge base',
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
