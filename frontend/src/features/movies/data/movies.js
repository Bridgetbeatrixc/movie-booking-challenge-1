import { asset } from "../../../shared/utils/assets.js";

export { asset };

export const movies = [
  {
    key: "breaking-dawn-part-2",
    title: "The Twilight Saga: Breaking Dawn - Part 2",
    shortTitle: "Breaking Dawn - Part 2",
    poster: asset("breaking-dawn-part-2.png"),
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
