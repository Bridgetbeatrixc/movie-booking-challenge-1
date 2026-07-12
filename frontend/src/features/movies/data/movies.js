import { asset } from "../../../utils/assets.js";

export { asset };

export const movies = [
  {
    key: "breaking-dawn-part-2",
    title: "The Twilight Saga: Breaking Dawn - Part 2",
    shortTitle: "Breaking Dawn - Part 2",
    poster: asset("breaking-dawn-part-2.png"),
    trailerVideoId: "Ocz50YJOFTM",
    description:
      "Bella begins her new life with Edward after the birth of their daughter, Renesmee. Their peace is threatened when the Volturi believe the child breaks vampire law, forcing the Cullens to gather allies from around the world. The story closes the saga with family loyalty, supernatural politics, and a final confrontation that decides whether their future can survive.",
    genres: "Romance / Fantasy",
    runtime: "1h 55m",
    rating: "7.0",
    year: "2012"
  },
  {
    key: "another-earth",
    title: "Another Earth",
    shortTitle: "Another Earth",
    poster: asset("another-earth.png"),
    trailerVideoId: "N8hEwMMDtFY",
    description:
      "Rhoda Williams is a gifted young woman whose life changes after a tragic accident on the same night a duplicate Earth appears in the sky. Years later, she searches for forgiveness while the world wonders whether Earth 2 holds another version of every person. The film blends quiet drama and science fiction to explore guilt, second chances, and the painful question of who we might have become.",
    genres: "Sci-Fi / Drama",
    runtime: "1h 32m",
    rating: "6.9",
    year: "2011"
  },
  {
    key: "arrival",
    title: "Arrival",
    shortTitle: "Arrival",
    poster: asset("arrival.png"),
    trailerVideoId: "tFMo3UJ4B4g",
    description:
      "When mysterious spacecraft land across the globe, linguist Louise Banks is recruited to help the military communicate with the visitors before fear turns into war. As she studies their language, she begins to experience time in a new and unsettling way. Arrival is a thoughtful science fiction drama about communication, memory, grief, and the choices people make when they understand the full weight of the future.",
    genres: "Sci-Fi / Drama",
    runtime: "1h 56m",
    rating: "7.9",
    year: "2016"
  },
  {
    key: "annabelle",
    title: "Annabelle",
    shortTitle: "Annabelle",
    poster: asset("annabelle.png"),
    trailerVideoId: "paFgQNPGlsg",
    description:
      "A young couple brings a vintage doll into their home, only for it to become the center of terrifying events after a violent attack. As strange disturbances grow more dangerous, the family realizes the doll is tied to something far darker than ordinary fear. Annabelle expands the haunted world of The Conjuring with a slow-building story of possession, ritual, and a threat that refuses to stay silent.",
    genres: "Horror",
    runtime: "1h 39m",
    rating: "5.4",
    year: "2014"
  }
];

export const comingSoonMovies = [
  {
    title: "The Nun",
    poster: asset("the-nun.png"),
    trailerVideoId: "pzD9zGcUNrw",
    description:
      "A priest and a novice investigate a remote abbey where an ancient darkness is waiting behind locked doors and broken prayers.",
    release: "Releases September 7, 2026"
  },
  {
    title: "Annabelle",
    poster: asset("annabelle.png"),
    release: "Releases October 3, 2026"
  },
  {
    title: "Breaking Dawn - Part 2",
    poster: asset("breaking-dawn-part-2.png"),
    release: "Releases November 16, 2026"
  }
];

export const comingSoon = comingSoonMovies;
export const defaultMovie = movies[0];
export const advanceSaleMovies = [comingSoonMovies[0], movies[0], movies[1], movies[3]];

export function getMovieKey(movie) {
  return movie?.key || movie?.slug || movie?.id || movie?._id || "";
}
