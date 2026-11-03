import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import "@/design/tokens.css";
import "./globals.css";

// Atkinson Hyperlegible: fonte feita para leitura fácil (letras maiores, pedido dela).
const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Incluir", template: "%s · Incluir" },
  description: "Seu caderno de Libras: guarde os sinais das aulas, revise e treine o alfabeto manual.",
  applicationName: "Incluir",
  appleWebApp: { capable: true, title: "Incluir", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#1f4fd1",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
