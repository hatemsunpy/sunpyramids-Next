import type { Locale } from "@/types/api";

const copy = {
  en: { search: "Search", placeholder: "What article are you looking for", popularTags: "Popular tags:", sortBy: "Sort by", asc: "A to Z", desc: "Z to A", empty: "There are no blogs found :)", seeMore: "See more" },
  fr: { search: "Rechercher", placeholder: "Quel article recherchez-vous ?", popularTags: "Tags populaires :", sortBy: "Trier par", asc: "A à Z", desc: "Z à A", empty: "Aucun blog trouvé.", seeMore: "Voir plus" },
  de: { search: "Suchen", placeholder: "Welchen Artikel suchen Sie?", popularTags: "Beliebte Tags:", sortBy: "Sortieren nach", asc: "A bis Z", desc: "Z bis A", empty: "Keine Blogs gefunden.", seeMore: "Mehr ansehen" },
  it: { search: "Cerca", placeholder: "Quale articolo stai cercando?", popularTags: "Tag popolari:", sortBy: "Ordina per", asc: "A–Z", desc: "Z–A", empty: "Nessun blog trovato.", seeMore: "Vedi altro" },
  pt: { search: "Pesquisar", placeholder: "Que artigo procura?", popularTags: "Tags populares:", sortBy: "Ordenar por", asc: "A a Z", desc: "Z a A", empty: "Nenhum blog encontrado.", seeMore: "Ver mais" },
  es: { search: "Buscar", placeholder: "¿Qué artículo estás buscando?", popularTags: "Etiquetas populares:", sortBy: "Ordenar por", asc: "A a Z", desc: "Z a A", empty: "No se encontraron blogs.", seeMore: "Ver más" },
  zh: { search: "搜索", placeholder: "您正在查找哪篇文章？", popularTags: "热门标签：", sortBy: "排序方式", asc: "A 到 Z", desc: "Z 到 A", empty: "未找到博客。", seeMore: "查看更多" },
} satisfies Record<Locale, Record<string, string>>;

export function blogCopy(locale: Locale) {
  return copy[locale] ?? copy.en;
}

const postCopy = {
  en: { home: "Home", blogs: "Blogs", contents: "Table of Content", plan: "Plan your next adventure now", explore: "Explore Tours", make: "Make Your Trip", relatedTours: "Related Tours", faqs: "Frequently Asked Questions", noFaqs: "There are no frequently asked questions :)", relatedBlogs: "Related Blogs", seeMore: "See more" },
  fr: { home: "Accueil", blogs: "Blogs", contents: "Table des matières", plan: "Planifiez votre prochaine aventure", explore: "Explorer les circuits", make: "Créer votre voyage", relatedTours: "Circuits associés", faqs: "Questions fréquentes", noFaqs: "Il n’y a pas encore de questions fréquentes :)", relatedBlogs: "Blogs associés", seeMore: "Voir plus" },
  de: { home: "Startseite", blogs: "Blogs", contents: "Inhaltsverzeichnis", plan: "Planen Sie jetzt Ihr nächstes Abenteuer", explore: "Touren entdecken", make: "Reise erstellen", relatedTours: "Ähnliche Touren", faqs: "Häufig gestellte Fragen", noFaqs: "Es gibt noch keine häufig gestellten Fragen :)", relatedBlogs: "Ähnliche Blogs", seeMore: "Mehr ansehen" },
  it: { home: "Home", blogs: "Blog", contents: "Indice", plan: "Pianifica ora la tua prossima avventura", explore: "Esplora i tour", make: "Crea il tuo viaggio", relatedTours: "Tour correlati", faqs: "Domande frequenti", noFaqs: "Non ci sono ancora domande frequenti :)", relatedBlogs: "Blog correlati", seeMore: "Vedi altro" },
  pt: { home: "Início", blogs: "Blogs", contents: "Índice", plan: "Planeie agora a sua próxima aventura", explore: "Explorar passeios", make: "Criar a sua viagem", relatedTours: "Passeios relacionados", faqs: "Perguntas frequentes", noFaqs: "Ainda não há perguntas frequentes :)", relatedBlogs: "Blogs relacionados", seeMore: "Ver mais" },
  es: { home: "Inicio", blogs: "Blogs", contents: "Tabla de contenido", plan: "Planifica ahora tu próxima aventura", explore: "Explorar tours", make: "Crear tu viaje", relatedTours: "Tours relacionados", faqs: "Preguntas frecuentes", noFaqs: "Todavía no hay preguntas frecuentes :)", relatedBlogs: "Blogs relacionados", seeMore: "Ver más" },
  zh: { home: "首页", blogs: "博客", contents: "目录", plan: "立即规划您的下一次冒险", explore: "探索行程", make: "定制旅程", relatedTours: "相关行程", faqs: "常见问题", noFaqs: "暂时没有常见问题 :) ", relatedBlogs: "相关博客", seeMore: "查看更多" },
} satisfies Record<Locale, Record<string, string>>;

export function blogPostCopy(locale: Locale) {
  return postCopy[locale] ?? postCopy.en;
}
