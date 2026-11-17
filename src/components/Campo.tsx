import type { InputHTMLAttributes } from "react";

export function Campo({ rotulo, id, ...resto }: { rotulo: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        className="rounded border border-zinc-400 bg-white px-3 py-2 text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700"
        {...resto}
      />
    </div>
  );
}

export function MensagemErro({ erro }: { erro?: string }) {
  return (
    <div role="alert" aria-live="polite">
      {erro && <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{erro}</p>}
    </div>
  );
}

export const classeBotao =
  "rounded bg-blue-800 px-4 py-2 font-medium text-white hover:bg-blue-900 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
