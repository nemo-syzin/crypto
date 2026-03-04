import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNewsDate, getAllNews, getFeaturedNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Новости – KenigSwap",
  description:
    "Актуальные новости, обновления сервиса и важные изменения KenigSwap.",
};

export default function NewsPage() {
  const allNews = getAllNews();
  const featured = getFeaturedNews()[0];

  return (
    <main className="pt-32 pb-20">
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="rounded-[36px] border border-[#001D8D]/10 bg-white shadow-[0_20px_60px_rgba(0,29,141,0.08)] px-6 py-8 md:px-10 md:py-10">
            <div className="inline-flex items-center rounded-full bg-[#001D8D]/8 px-4 py-2 text-sm font-medium text-[#001D8D]">
              Новости KenigSwap
            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A]">
              Актуальные новости и обновления сервиса
            </h1>

            <p className="mt-4 max-w-3xl text-base md:text-lg leading-8 text-slate-600">
              Здесь публикуются важные обновления платформы, изменения в сервисе,
              новости безопасности и сообщения о развитии KenigSwap.
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <section className="pb-10">
          <div className="container mx-auto px-4">
            <div className="rounded-[36px] border border-[#001D8D]/10 bg-gradient-to-br from-[#F5F9FF] to-white shadow-[0_24px_70px_rgba(0,29,141,0.10)] px-6 py-8 md:px-10 md:py-10">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center rounded-full bg-[#1D4ED8] px-3 py-1 font-semibold text-white">
                  Главное
                </span>
                <span className="text-slate-500">{formatNewsDate(featured.publishedAt)}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{featured.readTime}</span>
              </div>

              <p className="mt-5 text-sm font-medium text-[#2563EB]">
                {featured.category}
              </p>

              <h2 className="mt-3 max-w-4xl text-3xl md:text-5xl font-bold leading-tight text-[#0F172A]">
                {featured.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base md:text-lg leading-8 text-slate-600">
                {featured.excerpt}
              </p>

              <div className="mt-8">
                <Button
                  asChild
                   className="bg-[#001D8D] hover:bg-[#001D8D] hover:text-white text-white rounded-xl px-6 opacity-100 hover:opacity-90"
                >
                  <Link href={`/news/${featured.slug}`}>
                    Читать новость
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {allNews.map((item) => (
              <article
                key={item.slug}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full bg-[#001D8D]/8 px-3 py-1 font-medium text-[#2563EB]">
                    {item.category}
                  </span>
                  <span className="text-slate-500">{formatNewsDate(item.publishedAt)}</span>
                </div>

                <h2 className="mt-5 text-2xl font-bold leading-tight text-[#0F172A]">
                  <Link
                    href={`/news/${item.slug}`}
                    className="hover:text-[#001D8D] transition-colors"
                  >
                    {item.title}
                  </Link>
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{item.readTime}</span>

                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-[#001D8D] hover:opacity-80 transition-opacity"
                  >
                    Подробнее
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
