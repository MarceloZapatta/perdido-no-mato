const siteUrl = (
  import.meta.env.SITE_URL ||
  import.meta.env.PUBLIC_SITE_URL ||
  "https://perdido-no-mato.vercel.app"
).replace(/\/$/, "");

export const SITE = {
  name: "Perdido no Mato",
  description:
    "Um diário de viagens sobre se perder ao ar livre, encontrar bons caminhos e prestar atenção aos lugares entre os destinos.",
  url: siteUrl,
  locale: "pt-BR",
  language: "pt-BR",
  repositoryUrl: "https://github.com/MarceloZapatta/perdido-no-mato",
};

export const NAVIGATION = [
  { to: "/", label: "Início" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "Sobre" },
  // { to: "/contact", label: "Contato" },
];

export const CONTACT = {
  email: "oi@perdidonomato.com",
  socialHandle: "@perdidonomato",
  socialUrl: "https://x.com/perdidonomato",
};

export const FORMS = {
  contact: {
    action: "",
    method: "post",
    enctype: "application/x-www-form-urlencoded",
  },
  newsletter: {
    action: "",
    method: "post",
    enctype: "application/x-www-form-urlencoded",
  },
};

export const SOCIAL_LINKS = [
  { href: "/rss.xml", label: "Feed RSS", icon: "rss" },
  { href: CONTACT.socialUrl, label: `${SITE.name} no X`, icon: "twitter" },
  { href: SITE.repositoryUrl, label: `${SITE.name} no GitHub`, icon: "github" },
  { href: `mailto:${CONTACT.email}`, label: "E-mail", icon: "mail" },
];

export const authors = [
  {
    slug: "marcelo-zapatta",
    name: "Marcelo Zapatta",
    bio: "Viajante, trilheiro e explorador de lugares tranquilos.",
    longBio:
      "Marcelo escreve sobre viagens, trilhas, cachoeiras e os caminhos que fazem cada passeio valer a pena.",
    avatar: "/avatars/mz.png",
  },
];

export const categories = [{ slug: "cachoeiras", name: "Cachoeiras" }];

export const tags = [
  { slug: "writing", name: "Escrita" },
  { slug: "typography", name: "Tipografia" },
  { slug: "minimalism", name: "Minimalismo" },
  { slug: "tools", name: "Ferramentas" },
  { slug: "travel", name: "Viagem" },
  { slug: "process", name: "Processo" },
  { slug: "web", name: "Web" },
  { slug: "books", name: "Livros" },
  { slug: "trilha", name: "Trilha" },
  { slug: "viagem", name: "Viagem" },
  { slug: "ilhabela", name: "Ilhabela" },
  { slug: "cachoeira", name: "Cachoeira" },
  { slug: "veloso", name: "Veloso" },
];
