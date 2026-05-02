import "./globals.css";

export const metadata = {
  title: "Ayush Thakur · Product",
  description: "Portfolio — product, 0→1, AI-native.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
