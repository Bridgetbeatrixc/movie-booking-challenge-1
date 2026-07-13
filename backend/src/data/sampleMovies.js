const legacyMovies = [
  {
    title: "The Twilight Saga: Breaking Dawn - Part 2",
    shortTitle: "Breaking Dawn - Part 2",
    slug: "breaking-dawn-part-2",
    poster: "/assets/breaking-dawn-part-2.png",
    trailerVideoId: "Ocz50YJOFTM",
    description:
      "Bella begins her new life with Edward after the birth of their daughter, Renesmee. Their peace is threatened when the Volturi believe the child breaks vampire law, forcing the Cullens to gather allies from around the world. The story closes the saga with family loyalty, supernatural politics, and a final confrontation that decides whether their future can survive.",
    genres: ["Romance", "Fantasy"],
    runtime: "1h 55m",
    rating: 7.0,
    year: 2012,
    status: "showing",
    price: 35000
  },
  {
    title: "Another Earth",
    shortTitle: "Another Earth",
    slug: "another-earth",
    poster: "/assets/another-earth.png",
    trailerVideoId: "N8hEwMMDtFY",
    description:
      "Rhoda Williams is a gifted young woman whose life changes after a tragic accident on the same night a duplicate Earth appears in the sky. Years later, she searches for forgiveness while the world wonders whether Earth 2 holds another version of every person. The film blends quiet drama and science fiction to explore guilt, second chances, and the painful question of who we might have become.",
    genres: ["Sci-Fi", "Drama"],
    runtime: "1h 32m",
    rating: 6.9,
    year: 2011,
    status: "showing",
    price: 35000
  },
  {
    title: "Arrival",
    shortTitle: "Arrival",
    slug: "arrival",
    poster: "/assets/arrival.png",
    trailerVideoId: "tFMo3UJ4B4g",
    description:
      "When mysterious spacecraft land across the globe, linguist Louise Banks is recruited to help the military communicate with the visitors before fear turns into war. As she studies their language, she begins to experience time in a new and unsettling way. Arrival is a thoughtful science fiction drama about communication, memory, grief, and the choices people make when they understand the full weight of the future.",
    genres: ["Sci-Fi", "Drama"],
    runtime: "1h 56m",
    rating: 7.9,
    year: 2016,
    status: "showing",
    price: 35000
  },
  {
    title: "Annabelle",
    shortTitle: "Annabelle",
    slug: "annabelle",
    poster: "/assets/annabelle.png",
    trailerVideoId: "paFgQNPGlsg",
    description:
      "A young couple brings a vintage doll into their home, only for it to become the center of terrifying events after a violent attack. As strange disturbances grow more dangerous, the family realizes the doll is tied to something far darker than ordinary fear. Annabelle expands the haunted world of The Conjuring with a slow-building story of possession, ritual, and a threat that refuses to stay silent.",
    genres: ["Horror"],
    runtime: "1h 39m",
    rating: 5.4,
    year: 2014,
    status: "showing",
    price: 35000
  },
  {
    title: "The Nun",
    shortTitle: "The Nun",
    slug: "the-nun",
    poster: "/assets/the-nun.png",
    trailerVideoId: "pzD9zGcUNrw",
    description:
      "A priest with a haunted past and a novice on the edge of her final vows are sent to investigate a remote abbey after a shocking death. Inside the isolated monastery, they uncover a force that has taken the shape of a demonic nun. The Nun builds its horror through gothic halls, forbidden secrets, and a battle of faith against an evil that wants to escape into the world.",
    genres: ["Horror"],
    runtime: "1h 36m",
    rating: 5.3,
    year: 2018,
    status: "advance-sale",
    releaseDate: new Date("2026-09-07"),
    price: 35000
  }
];

const currentMovieSeeds = [
  ["Dune: Part Two", "Sci-Fi", "Adventure", 2024, 8.6], ["Inside Out 2", "Animation", "Family", 2024, 7.6],
  ["Deadpool & Wolverine", "Action", "Comedy", 2024, 7.6], ["Twisters", "Action", "Thriller", 2024, 6.5],
  ["The Wild Robot", "Animation", "Drama", 2024, 8.2], ["Wicked", "Fantasy", "Musical", 2024, 7.5],
  ["Moana 2", "Animation", "Adventure", 2024, 6.9], ["Gladiator II", "Action", "Drama", 2024, 6.6],
  ["Alien: Romulus", "Horror", "Sci-Fi", 2024, 7.1], ["Nosferatu", "Horror", "Fantasy", 2024, 7.2],
  ["Smile 2", "Horror", "Thriller", 2024, 6.7], ["Furiosa: A Mad Max Saga", "Action", "Sci-Fi", 2024, 7.5],
  ["A Complete Unknown", "Drama", "Music", 2024, 7.4], ["The Bikeriders", "Crime", "Drama", 2024, 6.8],
  ["Challengers", "Romance", "Drama", 2024, 7.1]
];

function posterDataUrl(title) {
  const safeTitle = title.replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071b36"/><stop offset="1" stop-color="#4c1d95"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><circle cx="470" cy="170" r="150" fill="#60a5fa" opacity=".2"/><text x="45" y="720" fill="white" font-family="Arial" font-size="42" font-weight="700">${safeTitle}</text><text x="45" y="775" fill="#93c5fd" font-family="Arial" font-size="22">BEATRIX MOVIE</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const currentMovies = currentMovieSeeds.map(([title, genre, secondaryGenre, year, rating]) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    title, shortTitle: title, slug,
    poster: posterDataUrl(title),
    trailerVideoId: "dQw4w9WgXcQ",
    description: `${title} is a recent Beatrix Movie release blending ${genre.toLowerCase()} and ${secondaryGenre.toLowerCase()} for a memorable cinema experience.`,
    genres: [genre, secondaryGenre], runtime: "1h 45m", rating, year,
    status: year === 2026 ? "advance-sale" : "showing", price: 35000
  };
});

export const sampleMovies = [...legacyMovies, ...currentMovies];
