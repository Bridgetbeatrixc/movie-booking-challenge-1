import { AdminShell } from "../features/admin/components/AdminShell.jsx";

export function AdminPage({ movies, moviesLoading }) {
  return <AdminShell movies={movies} moviesLoading={moviesLoading} />;
}
