import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNewsDate, getAllNews, getFeaturedNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Новости – KenigSwap",
  description:
    "Актуальные новости, обновления сервиса и важные изменения KenigSwap.",
  alternates: {
    canonical: "/news",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewsPage() {
  const allNews = getAllNews();
  const featured = getFeaturedNews()[0];

  return (
    <main className="relative overflow-hidden">
      <section className="pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_20px_80px_-24px_rgba(2,6,23,.35)] p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              Новости KenigSwap
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Актуальные новости и обновления сервиса
              </h1>
              <p className="mt-5 text-base sm:text-lg leading-8 text-slate-600 dark:text-slate-300">
                Здесь публикуются важные обновления платформы, изменения в
                сервисе, новости безопасности и сообщения о развитии KenigSwap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-blue-500/15 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10 dark:from-blue-500/10 dark:to-cyan-400/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-3 py-1 font-medium">
                  Главное
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {formatNewsDate(featured.publishedAt)}
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {featured.readTime}
                </span>
              </div>

              <div className="mt-5 max-w-4xl">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {featured.category}
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {featured.title}
                </h2>
                <p className="mt-4 text-base sm:text-lg leading-8 text-slate-600 dark:text-slate-300">
                  {featured.excerpt}
                </p>
              </div>

              <div className="mt-8">
                <Button asChild size="lg" className="rounded-xl px-6">
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

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {allNews.map((item) => (
              <article
                key={item.slug}
                className="group rounded-[1.75rem] border border-white/10 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_16px_60px_-24px_rgba(2,6,23,.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-24px_rgba(2,6,23,.32)]"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-medium text-blue-700 dark:text-blue-300">
                    {item.category}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatNewsDate(item.publishedAt)}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold leading-tight text-slate-900 dark:text-white">
                  <Link
                    href={`/news/${item.slug}`}
                    className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300"
                  >
                    {item.title}
                  </Link>
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {item.readTime}
                  </span>

                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-300"
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
