export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  publishedAt: string;
  readTime: string;
  isFeatured?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    slug: "launch-new-exchange-flow",
    title: "Обновлённый сценарий обмена стал быстрее и удобнее",
    excerpt:
      "Мы оптимизировали путь пользователя от заявки до подтверждения сделки, чтобы сократить время оформления и сделать процесс ещё прозрачнее.",
    category: "Обновления сервиса",
    publishedAt: "2026-03-01",
    readTime: "3 мин",
    isFeatured: true,
    content: [
      "Команда KenigSwap обновила основной пользовательский сценарий оформления обмена. Мы упростили структуру шагов, уменьшили количество лишних действий и улучшили навигацию между этапами.",
      "Теперь клиенту проще проверить направление обмена, сумму и ключевые данные до финального подтверждения. Это снижает риск ошибок и делает сам процесс понятнее как для новых, так и для постоянных пользователей.",
      "Дальше мы продолжим улучшать интерфейс и добавлять новые элементы прозрачности: статусы операций, расширенные уведомления и более подробные подсказки на каждом этапе."
    ]
  },
  {
    slug: "security-standards-update",
    title: "Усилены внутренние стандарты безопасности операций",
    excerpt:
      "Мы обновили внутренние процедуры проверки, чтобы повысить надёжность обработки заявок и защиту клиентских операций.",
    category: "Безопасность",
    publishedAt: "2026-02-24",
    readTime: "4 мин",
    content: [
      "Безопасность остаётся одним из ключевых приоритетов KenigSwap. Мы расширили набор внутренних процедур верификации и контроля, применяемых при обработке заявок.",
      "Обновления затронули проверку реквизитов, логику подтверждения ключевых параметров сделки и внутренние регламенты обработки спорных ситуаций.",
      "Эти изменения помогают сделать сервис ещё более устойчивым, а также обеспечивают дополнительную уверенность для клиентов при совершении операций."
    ]
  },
  {
    slug: "support-response-improved",
    title: "Служба поддержки стала отвечать ещё оперативнее",
    excerpt:
      "Мы пересобрали внутренний процесс обработки обращений, чтобы ускорить ответы по заявкам, статусам и консультациям.",
    category: "Поддержка",
    publishedAt: "2026-02-18",
    readTime: "2 мин",
    content: [
      "Мы обновили внутреннюю маршрутизацию обращений, чтобы типовые вопросы обрабатывались быстрее, а сложные кейсы сразу попадали профильному специалисту.",
      "За счёт этого сократилось время ответа по вопросам, связанным со статусами заявок, подтверждением переводов и уточнением условий обмена.",
      "Следующий этап — расширение базы подсказок и более удобная структура разделов помощи на сайте."
    ]
  }
];

export function getAllNews() {
  return [...newsItems].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedNews() {
  return getAllNews().filter((item) => item.isFeatured);
}

export function getNewsBySlug(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}

export function getRelatedNews(currentSlug: string, limit = 2) {
  return getAllNews()
    .filter((item) => item.slug !== currentSlug)
    .slice(0, limit);
}

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
