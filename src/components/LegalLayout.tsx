import { ReactNode } from "react";
import { Link } from "react-router-dom";

export type LegalBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; content: ReactNode }
  | { type: "ul"; items: ReactNode[] };

interface LegalLayoutProps {
  title: string;
  updated: string;
  blocks: LegalBlock[];
}

function RenderBlock({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="font-headline-md text-[22px] sm:text-[26px] text-primary font-extrabold uppercase mt-14 mb-5 first:mt-0">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-headline-md text-[17px] text-primary font-bold mt-8 mb-3">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="font-body-md text-on-surface-variant leading-relaxed mb-5">
          {block.content}
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2 mb-5 list-none">
          {block.items.map((item, i) => (
            <li key={i} className="font-body-md text-on-surface-variant leading-relaxed flex gap-3">
              <span className="text-primary mt-[2px] flex-shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

export function LegalLayout({ title, updated, blocks }: LegalLayoutProps) {
  return (
    <div className="bg-background text-on-surface font-sans min-h-screen">
      <nav className="border-b border-white/5 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter h-20 flex items-center justify-between">
          <Link
            to="/"
            className="font-headline-md text-[18px] sm:text-[22px] font-extrabold text-primary whitespace-nowrap"
          >
            REY ACADEMY
          </Link>
          <Link
            to="/"
            className="font-label-caps text-[12px] text-on-surface-variant hover:text-primary transition-colors tracking-wide font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            VOLVER AL INICIO
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-margin-mobile md:px-gutter py-16 sm:py-24">
        <span className="font-label-caps text-primary tracking-[0.3em] mb-4 block font-bold">
          REY ACADEMY
        </span>
        <h1 className="font-headline-lg text-[28px] sm:text-[38px] text-primary font-extrabold uppercase leading-tight mb-4">
          {title}
        </h1>
        <p className="font-label-caps text-[12px] text-on-surface-variant/70 tracking-wide font-bold mb-14 pb-8 border-b border-white/5">
          Última actualización: {updated} · Versión 1.0
        </p>

        <div>
          {blocks.map((block, i) => (
            <RenderBlock key={i} block={block} />
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
            © 2026 REY ACADEMY. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-8 text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
            <Link className="hover:text-primary transition-colors" to="/terms-and-conditions">
              Términos y Condiciones
            </Link>
            <Link className="hover:text-primary transition-colors" to="/privacy-policy">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
