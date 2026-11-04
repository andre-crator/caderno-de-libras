// Ícones próprios em SVG (sem biblioteca), traço em currentColor.
export type NomeIcone = "inicio" | "aulas" | "caderno" | "revisar" | "soletrar" | "sair" | "seta" | "check";

const CAMINHOS: Record<NomeIcone, React.ReactNode> = {
  inicio: <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  aulas: (
    <>
      <rect x="3" y="5" width="18" height="13" rx="2.5" />
      <path d="m10.5 9 4 2.5-4 2.5z" fill="currentColor" stroke="none" />
      <path d="M8 21h8" />
    </>
  ),
  caderno: (
    <>
      <path d="M6 3.5h11a2 2 0 0 1 2 2v15H8a2 2 0 0 1-2-2z" />
      <path d="M6 18.5a2 2 0 0 1 2-2h11M10 8h6" />
    </>
  ),
  revisar: (
    <>
      <rect x="4" y="7" width="12" height="14" rx="2" />
      <path d="M8 3.5h10a2 2 0 0 1 2 2V17" />
    </>
  ),
  soletrar: (
    <path d="M8 21v-9.5a1.5 1.5 0 0 1 3 0V10 4.5a1.5 1.5 0 0 1 3 0V11 6.5a1.5 1.5 0 0 1 3 0V15c0 3.3-2.4 6-5.5 6H11m-3-7-2-1.5a1.5 1.5 0 0 0-2 2.2L8 19" />
  ),
  sair: <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" />,
  seta: <path d="M5 12h14m-5-5 5 5-5 5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

export function Icone({ nome, tamanho = 24 }: { nome: NomeIcone; tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {CAMINHOS[nome]}
    </svg>
  );
}
