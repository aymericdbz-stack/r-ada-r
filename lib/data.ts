export type Event = {
  id: string;
  title: string;
  coverTag: string;
  date: string;
  time: string;
  location: string;
  district: string;
  category: string;
  vibe: "avant-garde" | "underground" | "premium";
  tags: string[];
  curator: string;
  availability: string;
  blurb: string;
};

export type Category = {
  id: string;
  description: string;
  vibe: Event["vibe"];
  icon?: string;
  eventCount?: string;
  actionLabel?: string;
};

export type Curator = {
  id: string;
  name: string;
  bio: string;
  vibe: Event["vibe"];
  followers: string;
  nextEventId: string;
};

export type FeaturedCalendar = {
  id: string;
  name: string;
  location: string;
  description: string;
  icon: string;
  vibe: Event["vibe"];
};

export type UserProfile = {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  moodboard: string[];
  connectedNetworks: string[];
  upcomingEventIds: string[];
  pastEventIds: string[];
  highlights: Array<{
    title: string;
    value: string;
    context: string;
  }>;
};

export const events: Event[] = [
  {
    id: "ledger-op3n",
    title: "Ledger OP3N 2025",
    coverTag: "Live",
    date: "2025-10-23",
    time: "13:00",
    location: "Gaîté Lyrique",
    district: "3e",
    category: "Tech",
    vibe: "premium",
    tags: ["Tech", "Innovation", "Talk"],
    curator: "Ledger Collective",
    availability: "En direct",
    blurb:
      "Une plongée dans les communautés Web3 parisiennes, avec workshops et live podcast.",
  },
  {
    id: "synbio-panel",
    title: "Exclusive Synbio Future Panel & Networking",
    coverTag: "Curated",
    date: "2025-10-27",
    time: "18:00",
    location: "Station F",
    district: "13e",
    category: "Tech",
    vibe: "avant-garde",
    tags: ["Biotech", "Networking"],
    curator: "Synbio Future",
    availability: "Places limitées",
    blurb:
      "Panel intimiste avec des founders deeptech, suivi d'un cocktail expérientiel à Station F.",
  },
  {
    id: "jazz-spirals",
    title: "Jazz Spirals • Nuit improvisée",
    coverTag: "Live",
    date: "2025-10-24",
    time: "22:30",
    location: "Le Duc des Lombards",
    district: "1er",
    category: "Jazz",
    vibe: "underground",
    tags: ["Jazz", "Nightlife"],
    curator: "Collectif Spiral",
    availability: "Quasi complet",
    blurb:
      "Session nocturne avec jam libre, visuels génératifs et dégustation de cocktails signatures.",
  },
  {
    id: "atelier-digital",
    title: "Late Night Atelier • Arts numériques",
    coverTag: "Immersif",
    date: "2025-10-23",
    time: "20:00",
    location: "Gaîté Lyrique",
    district: "3e",
    category: "Art Digital",
    vibe: "avant-garde",
    tags: ["Art Digital", "Immersif"],
    curator: "Gaîté Lyrique",
    availability: "Encore 12 places",
    blurb:
      "Atelier hands-on pour manipuler lumière, son et IA générative avec les résidents de la Gaîté.",
  },
  {
    id: "food-lab",
    title: "Food Lab • Dîner expérimental",
    coverTag: "Secret",
    date: "2025-10-25",
    time: "19:30",
    location: "Atelier Basfroi",
    district: "11e",
    category: "Food",
    vibe: "premium",
    tags: ["Food", "Expérience"],
    curator: "Tableau Secret",
    availability: "Invitations restantes: 8",
    blurb:
      "Carte immersive imaginée par trois chefs et un parfumeur pour un voyage multi-sensoriel.",
  },
  {
    id: "opera-bastille",
    title: "Opéra Remix • Carmen Rework",
    coverTag: "Scène",
    date: "2025-10-26",
    time: "20:30",
    location: "Opéra Bastille",
    district: "12e",
    category: "Scène & Spectacle",
    vibe: "premium",
    tags: ["Classique", "Hybrid"],
    curator: "Opéra National de Paris",
    availability: "Sélection RadaR",
    blurb:
      "Le grand classique revisité par un metteur en scène contemporain et une scénographie laser.",
  },
];

export const categories: Category[] = [
  {
    id: "Tech",
    description:
      "Talks, conférences et bootcamps pour les passionnés de création digitale et IA.",
    vibe: "avant-garde",
    icon: "🧠",
    eventCount: "1 k Événements",
    actionLabel: "Atelier tech immersif",
  },
  {
    id: "Art Digital",
    description:
      "Expositions immersives, live AV et ateliers autour de l'art numérique.",
    vibe: "avant-garde",
    icon: "🎨",
    eventCount: "954 Événements",
    actionLabel: "Expo art digital",
  },
  {
    id: "Jazz",
    description:
      "Clubs intimistes, sessions improvisées et résidences d'artistes.",
    vibe: "underground",
    icon: "🎷",
    eventCount: "624 Événements",
    actionLabel: "Concert jazz",
  },
  {
    id: "Food",
    description:
      "Tables cachées, diners performatifs et pop-ups culinaires.",
    vibe: "premium",
    icon: "🥘",
    eventCount: "37 Événements",
    actionLabel: "Festival gastronomique",
  },
  {
    id: "Clubbing",
    description:
      "Soirées électro, house & techno avec line-up curaté par les collectifs parisiens.",
    vibe: "underground",
    icon: "💿",
    eventCount: "812 Événements",
    actionLabel: "Nuit clubbing",
  },
  {
    id: "Scène & Spectacle",
    description:
      "Théâtre, danse, opéra et formats hybrides pour scénophiles curieux.",
    vibe: "premium",
    icon: "🎭",
    eventCount: "512 Événements",
    actionLabel: "Spectacle scénique",
  },
  {
    id: "Bien-être",
    description:
      "Respiration, mouvement & pratiques holistiques pour garder l&apos;équilibre.",
    vibe: "premium",
    icon: "🧘",
    eventCount: "1 k Événements",
    actionLabel: "Atelier bien-être",
  },
  {
    id: "Climat",
    description:
      "Débats, workshops, activations autour des transitions écologiques.",
    vibe: "avant-garde",
    icon: "🌱",
    eventCount: "512 Événements",
    actionLabel: "Forum climat",
  },
  {
    id: "IA",
    description:
      "Meetups, conférences et labs pour les passionnés d&apos;intelligence artificielle.",
    vibe: "avant-garde",
    icon: "🤖",
    eventCount: "2 k Événements",
    actionLabel: "Rencontre IA créative",
  },
  {
    id: "Fitness",
    description:
      "Sessions sportives, training collectifs et expériences outdoor.",
    vibe: "premium",
    icon: "🏃",
    eventCount: "726 Événements",
    actionLabel: "Session sportive culturelle",
  },
  {
    id: "Crypto",
    description:
      "Rencontres Web3, DAO meetups et formations pour builders.",
    vibe: "underground",
    icon: "🪙",
    eventCount: "1 k Événements",
    actionLabel: "Forum crypto culture",
  },
];

export const curators: Curator[] = [
  {
    id: "club-matin",
    name: "Club Matin",
    bio: "Collectif house & minimal, afters intimistes dans l'est parisien.",
    vibe: "underground",
    followers: "4.8k",
    nextEventId: "jazz-spirals",
  },
  {
    id: "atelier-lumieres",
    name: "Atelier des Lumières",
    bio: "Expériences immersives autour des arts digitaux et narrations hybrides.",
    vibe: "avant-garde",
    followers: "22k",
    nextEventId: "atelier-digital",
  },
  {
    id: "tableau-secret",
    name: "Tableau Secret",
    bio: "Cheffes et parfumeurs pour imaginer des expériences culinaires sensorielles.",
    vibe: "premium",
    followers: "3.1k",
    nextEventId: "food-lab",
  },
];

export const featuredCalendars: FeaturedCalendar[] = [
  {
    id: "climate-house",
    name: "Événements @ Climate House",
    location: "Paris",
    description: "Bienvenue à la maison ! Des événements autour de 6 collectifs.",
    icon: "🏡",
    vibe: "avant-garde",
  },
  {
    id: "reading-rhythms",
    name: "Reading Rhythms Global",
    location: "Global",
    description: "Not a book club. A reading party pour vivre musique & idées.",
    icon: "📚",
    vibe: "premium",
  },
  {
    id: "build-club",
    name: "Build Club",
    location: "Sydney",
    description:
      "The best place to learn AI. Curated avec l'équipe Outliers chaque semaine.",
    icon: "🛠️",
    vibe: "avant-garde",
  },
  {
    id: "south-park",
    name: "South Park Commons",
    location: "San Francisco",
    description:
      "Communauté de builders et chercheurs. Deep dives, salons et labs.",
    icon: "🌀",
    vibe: "premium",
  },
  {
    id: "design-buddies",
    name: "Design Buddies",
    location: "Global",
    description: "Pour les designers qui aiment apprendre, partager et créer.",
    icon: "🎀",
    vibe: "avant-garde",
  },
  {
    id: "cursor-community",
    name: "Cursor Community",
    location: "Remote",
    description:
      "Builders AI-first, sprints produit et feedback loops toutes les semaines.",
    icon: "⬛",
    vibe: "avant-garde",
  },
];

export const userProfile: UserProfile = {
  id: "alya-l",
  name: "Alya Lenoir",
  headline: "Curieuse de lives électroniques, art numérique et food expérimental.",
  avatar: "🌀",
  moodboard: ["Avant-garde", "Immersif", "Clubbing", "Food pairing"],
  connectedNetworks: ["Spotify", "Luma", "Instagram"],
  upcomingEventIds: ["food-lab", "atelier-digital", "ledger-op3n"],
  pastEventIds: ["synbio-panel", "jazz-spirals"],
  highlights: [
    {
      title: "Score d'exploration",
      value: "92",
      context: "Top 3% du collectif RadaR",
    },
    {
      title: "Collectifs suivis",
      value: "14",
      context: "Dernier: Club Matin",
    },
    {
      title: "Invitations privées",
      value: "5",
      context: "À consommer sous 7 jours",
    },
  ],
};

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}
