import type { Metadata } from "next";
import "@/design/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Caderno de Libras", template: "%s · Caderno de Libras" },
  description: "Descrição curta do app (aparece no Google e ao compartilhar o link).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
