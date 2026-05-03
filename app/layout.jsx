import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Ayush Thakur · Product",
  description: "Portfolio — product, 0→1, AI-native.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
