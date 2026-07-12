import { AdminShell } from "../features/admin/components/AdminShell.jsx";

export function AdminPage({ movies, moviesLoading, onMovieCreated }) {
  return <AdminShell movies={movies} moviesLoading={moviesLoading} onMovieCreated={onMovieCreated} />;
}
