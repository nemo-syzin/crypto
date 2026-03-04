import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatNewsDate,
  getAllNews,
  getNewsBySlug,
  getRelatedNews,
} from "@/lib/news";

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return getAllNews().map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const article = getNewsBySlug(params.slug);

  if (!article) {
    return {
      title: "Новость не найдена – KenigSwap",
    };
  }

  return {
    title: `${article.title} – KenigSwap`,
    description: article.excerpt,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function NewsArticlePage({ params }: PageProps) {
  const article = getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedNews(article.slug, 2);

  return (
    <main className="relative overflow-hidden pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="rounded-xl">
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ко всем новостям
            </Link>
          </Button>
        </div>

        <article className="rounded-[2rem] border border-white/10 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_80px_-24px_rgba(2,6,23,.35)]">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-medium text-blue-700 dark:text-blue-300">
              {article.category}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatNewsDate(article.publishedAt)}
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-500 dark:text-slate-400">
              {article.readTime}
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {article.title}
          </h1>

          <p className="mt-6 text-base sm:text-lg leading-8 text-slate-600 dark:text-slate-300">
            {article.excerpt}
          </p>

          <div className="mt-10 space-y-6">
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-8 text-slate-700 dark:text-slate-200"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-10">
            <div className="rounded-[2rem] border border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Другие новости
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {related.map((item) => (
                  <div
                    key={item.slug}
                    className="rounded-3xl border border-white/10 bg-white/70 dark:bg-slate-950/40 p-5"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatNewsDate(item.publishedAt)}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.excerpt}
                    </p>
                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-5 inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      Читать
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
