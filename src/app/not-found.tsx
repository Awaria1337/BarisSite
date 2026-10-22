import Link from "next/link";
import { wrap } from "@/components/blocks";

export const metadata = { title: "Sayfa bulunamadı", robots: { index: false } };

export default function NotFound() {
  return (
    <section className={`${wrap} py-32 text-center`}>
      <h1 className="text-6xl sm:text-7xl">
        Sayfa bulunamadı<span className="text-kakao">.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-[40ch] text-gri">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Link href="/" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-kakao px-6 font-medium text-fildisi hover:bg-kakao-koyu">
        Ana sayfaya dön
      </Link>
    </section>
  );
}
