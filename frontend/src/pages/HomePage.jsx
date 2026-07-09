import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { AdvanceSales } from "../components/home/AdvanceSales";
import { AppPromo } from "../components/home/AppPromo";
import { ComingSoon } from "../components/home/ComingSoon";
import { FeaturedMovies } from "../components/home/FeaturedMovies";
import { Hero } from "../components/home/Hero";
import { Promos } from "../components/home/Promos";
import { ShowingNow } from "../components/home/ShowingNow";

export function HomePage({ movies, moviesError, moviesLoading, selectedMovie, setSelectedMovie }) {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Promos />
        <FeaturedMovies
          movies={movies}
          moviesError={moviesError}
          moviesLoading={moviesLoading}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
        <ComingSoon movies={movies} />
        <ShowingNow movies={movies} />
        <AdvanceSales movies={movies} />
      </main>
      <AppPromo />
      <Footer />
    </>
  );
}
