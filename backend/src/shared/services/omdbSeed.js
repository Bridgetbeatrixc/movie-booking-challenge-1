const genrePools = {
  Action: ["Top Gun: Maverick", "John Wick: Chapter 4", "Mission: Impossible - Dead Reckoning Part One", "Furiosa: A Mad Max Saga", "Gladiator II", "The Batman", "Nobody", "The Northman"],
  Adventure: ["Dune: Part Two", "Avatar: The Way of Water", "The Fall Guy", "Kingdom of the Planet of the Apes", "Uncharted", "Jungle Cruise", "The Lost City", "Bullet Train"],
  Animation: ["The Wild Robot", "Inside Out 2", "The Boy and the Heron", "Spider-Man: Across the Spider-Verse", "Puss in Boots: The Last Wish", "Elemental", "The Super Mario Bros. Movie", "Turning Red"],
  Comedy: ["Deadpool & Wolverine", "The Holdovers", "Barbie", "The Fall Guy", "The Unbearable Weight of Massive Talent", "Free Guy", "Bullet Train", "The Grand Budapest Hotel"],
  Crime: ["The Bikeriders", "Killers of the Flower Moon", "The Irishman", "The Gentlemen", "The Departed", "Knives Out", "The Wolf of Wall Street", "Heat"],
  Drama: ["Oppenheimer", "Anatomy of a Fall", "Past Lives", "The Fabelmans", "A Complete Unknown", "The Whale", "Women Talking", "The Father"],
  Horror: ["Nosferatu", "Longlegs", "Smile 2", "Alien: Romulus", "Talk to Me", "The Exorcist: Believer", "Barbarian", "The Black Phone"],
  Romance: ["Challengers", "Anyone but You", "Past Lives", "The Idea of You", "La La Land", "Pride & Prejudice", "The Notebook", "About Time"],
  "Sci-Fi": ["Dune: Part Two", "The Creator", "Godzilla Minus One", "Alien: Romulus", "Everything Everywhere All at Once", "Arrival", "Interstellar", "Blade Runner 2049", "The Martian", "Ex Machina", "Edge of Tomorrow"],
  Thriller: ["The Killer", "Trap", "Civil War", "A Quiet Place: Day One", "The Menu", "Gone Girl", "Prisoners", "Memento", "Nightcrawler", "Sicario", "The Invisible Man", "The Guilty"]
};

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseRuntime(runtime) {
  const minutes = Number.parseInt(String(runtime || "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(minutes) && minutes > 0 ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m` : "1h 45m";
}

async function fetchMovie(title, apiKey) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&t=${encodeURIComponent(title)}&plot=full&r=json`);
  if (!response.ok) throw new Error(`OMDb request failed for ${title}: ${response.status}`);
  const movie = await response.json();
  if (movie.Response !== "True" || movie.Poster === "N/A") return null;
  return movie;
}

export async function fetchOmdbMovies(apiKey, perGenre = 5) {
  if (!apiKey) throw new Error("OMDB_API_KEY is missing. Add the OMDb key to backend/.env.");
  const results = new Map();

  for (const [genre, titles] of Object.entries(genrePools)) {
    let selected = 0;
    for (const title of titles) {
      if (selected >= perGenre) break;
      const movie = await fetchMovie(title, apiKey);
      if (!movie || !movie.Genre.split(", ").includes(genre)) continue;
      results.set(movie.imdbID, { movie, seedGenre: genre });
      selected += 1;
    }
    if (selected < perGenre) console.warn(`OMDb returned only ${selected}/${perGenre} movies for ${genre}.`);
  }

  return [...results.values()].map(({ movie, seedGenre }) => ({
    title: movie.Title,
    shortTitle: movie.Title,
    slug: `${slugify(movie.Title)}-${movie.imdbID.toLowerCase()}`,
    imdbId: movie.imdbID,
    poster: movie.Poster,
    trailerVideoId: "",
    description: movie.Plot === "N/A" ? `${movie.Title} (${movie.Year})` : movie.Plot,
    genres: movie.Genre.split(", "),
    runtime: parseRuntime(movie.Runtime),
    rating: Number.parseFloat(movie.imdbRating) || 0,
    year: Number.parseInt(movie.Year, 10) || new Date().getFullYear(),
    status: "showing",
    price: 35000,
    seedGenre
  }));
}
