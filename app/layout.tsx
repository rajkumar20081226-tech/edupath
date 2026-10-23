import './globals.css';

export const metadata = {
  title: 'EduPath',
  description: 'AI study assistant for students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
