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
  };
}

export default function NewsArticlePage({ params }: PageProps) {
  const article = getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedNews(article.slug, 2);

  return (
    <main className="pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="text-[#001D8D] hover:bg-[#001D8D]/5 rounded-xl"
          >
            <Link href="https://kenigswap.com/news/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ко всем новостям
            </Link>
          </Button>
        </div>

        <article className="rounded-[36px] border border-[#001D8D]/10 bg-white shadow-[0_20px_60px_rgba(0,29,141,0.08)] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center rounded-full bg-[#001D8D]/8 px-3 py-1 font-medium text-[#2563EB]">
              {article.category}
            </span>
            <span className="text-slate-500">{formatNewsDate(article.publishedAt)}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{article.readTime}</span>
          </div>

          <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight leading-tight text-[#0F172A]">
            {article.title}
          </h1>

          <p className="mt-5 text-base md:text-lg leading-8 text-slate-600">
            {article.excerpt}
          </p>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-[#001D8D]/15 via-slate-200 to-transparent" />

          <div className="mt-8 space-y-6">
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg leading-8 text-slate-700"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-10">
            <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-7 md:px-8 md:py-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
                Другие новости
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {related.map((item) => (
                  <article
                    key={item.slug}
                    className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="inline-flex items-center rounded-full bg-[#001D8D]/8 px-3 py-1 font-medium text-[#2563EB]">
                        {item.category}
                      </span>
                      <span className="text-slate-500">
                        {formatNewsDate(item.publishedAt)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold leading-tight text-[#0F172A]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/news/${item.slug}`}
                      className="mt-5 inline-flex items-center text-sm font-semibold text-[#001D8D] hover:opacity-80 transition-opacity"
                    >
                      Читать
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
