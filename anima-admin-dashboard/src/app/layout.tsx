import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuroraBackground } from "@/components/layout/aurora-background";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aníma | Admin Dashboard",
  description: "Panel de administración premium para la app móvil Aníma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} relative min-h-screen text-foreground overflow-hidden`}>
        <AuroraBackground />
        
        <div className="flex h-screen relative z-10">
          <Sidebar />
          
          <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6 lg:p-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
