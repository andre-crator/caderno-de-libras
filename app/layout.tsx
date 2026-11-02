import type { Metadata } from "next";
import "@/design/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nome do App", template: "%s · Nome do App" },
  description: "Descrição curta do app (aparece no Google e ao compartilhar o link).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
