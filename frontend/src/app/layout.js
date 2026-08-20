import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/components/theme/ThemeProvider";

export const metadata = {
  title: "VegaRecords - Personal OS & Knowledge System",
  description: "Next-generation personal operating system and knowledge tracker.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-[var(--primary)] selection:text-white">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
