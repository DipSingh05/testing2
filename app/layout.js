import './globals.css';

export const metadata = {
  title: 'Upwork Scraper',
  description: 'Find freelance opportunities on Upwork',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
