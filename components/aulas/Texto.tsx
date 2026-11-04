import { partesComNegrito } from "@/lib/aulas/aulas";

/** Texto das aulas com **negrito**, sem HTML cru. */
export function Texto({ children }: { children: string }) {
  return (
    <>
      {partesComNegrito(children).map((p, i) => (p.negrito ? <strong key={i}>{p.texto}</strong> : <span key={i}>{p.texto}</span>))}
    </>
  );
}
