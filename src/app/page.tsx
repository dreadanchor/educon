import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Educon</h1>
        <p className="mt-2 text-zinc-600">Colégio Primeiro Sol · em construção</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded bg-blue-800 px-4 py-2 font-medium text-white hover:bg-blue-900"
        >
          Acessar
        </Link>
      </div>
    </main>
  );
}
