import Link from "next/link";
import { sair } from "@/lib/auth/acoes";

export function CabecalhoArea({ titulo, nome }: { titulo: string; nome: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Educon · {titulo}</p>
        <p className="font-medium">{nome}</p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/trocar-senha" className="text-zinc-700 underline underline-offset-2">
          Trocar senha
        </Link>
        <form action={sair}>
          <button
            type="submit"
            className="rounded border border-zinc-300 px-3 py-1.5 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
