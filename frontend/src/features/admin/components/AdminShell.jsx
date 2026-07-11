import { useEffect, useMemo, useState } from "react";
import { createMovie, updateMovie, deleteMovie } from "../../movies/api/movieApi.js";
import { createShowtime, deleteShowtime, getShowtimes, updateShowtime } from "../../showtimes/api/showtimeApi.js";
import { showtimeCatalog } from "../../showtimes/data/showtimes.js";

const adminTabs = [
  { id: "dashboard", hash: "#admin", label: "Dashboard", icon: "▦" },
  { id: "movies", hash: "#admin-movies", label: "Movies", icon: "🎬" },
  { id: "showtimes", hash: "#admin-showtimes", label: "Showtimes", icon: "🕒" },
  { id: "bookings", hash: "#admin-bookings", label: "Bookings", icon: "🎟" },
  { id: "halls", hash: "#admin-halls", label: "Halls", icon: "▣" },
  { id: "reports", hash: "#admin-reports", label: "Reports", icon: "↗" }
];

const sampleBookings = [
  { id: "BM-701D78", customer: "guest@example.com", movie: "Arrival", seats: "B8, C8", status: "paid", total: 70000 },
  { id: "BM-92A113", customer: "demo@beatrix.test", movie: "The Nun", seats: "A4, A5", status: "pending", total: 70000 },
  { id: "BM-5582CC", customer: "cinema@beatrix.test", movie: "Another Earth", seats: "D1", status: "paid", total: 35000 }
];

const sampleHalls = [
  { name: "Studio 1", type: "Regular", seats: 72, status: "Open" },
  { name: "Studio 2", type: "Premiere", seats: 48, status: "Open" },
  { name: "IMAX Hall", type: "IMAX", seats: 96, status: "Maintenance" }
];

export function AdminShell({ movies = [], moviesLoading = false }) {
  const activeTab = getActiveTab();
  const stats = useMemo(() => buildStats(movies, sampleBookings), [movies]);

  return (
    <div className="admin-page min-h-screen">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#">
          <span>BM</span>
          <div>
            <strong>Beatrix Movie</strong>
            <small>Admin Panel</small>
          </div>
        </a>

        <nav className="admin-nav" aria-label="Admin sections">
          {adminTabs.map((tab) => (
            <a className={activeTab === tab.id ? "active" : ""} href={tab.hash} key={tab.id}>
              <span>{tab.icon}</span>
              {tab.label}
            </a>
          ))}
        </nav>

        <a className="admin-home-link" href="#">
          ← Back to cinema
        </a>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p>ADMINISTRATION</p>
            <h1>{adminTabs.find((tab) => tab.id === activeTab)?.label || "Dashboard"}</h1>
          </div>
          <span className="admin-status">Sandbox mode</span>
        </header>

        {activeTab === "dashboard" ? <AdminDashboard bookings={sampleBookings} movies={movies} moviesLoading={moviesLoading} stats={stats} /> : null}
        {activeTab === "movies" ? <AdminMovies movies={movies} moviesLoading={moviesLoading} /> : null}
        {activeTab === "showtimes" ? <AdminShowtimes movies={movies} /> : null}
        {activeTab === "bookings" ? <AdminBookings bookings={sampleBookings} /> : null}
        {activeTab === "halls" ? <AdminHalls halls={sampleHalls} /> : null}
        {activeTab === "reports" ? <AdminReports bookings={sampleBookings} stats={stats} /> : null}
      </main>
    </div>
  );
}

function getActiveTab() {
  const hash = window.location.hash;

  if (hash === "#admin-movies") return "movies";
  if (hash === "#admin-showtimes") return "showtimes";
  if (hash === "#admin-bookings") return "bookings";
  if (hash === "#admin-halls") return "halls";
  if (hash === "#admin-reports") return "reports";

  return "dashboard";
}

function buildStats(movies, bookings) {
  const paidBookings = bookings.filter((booking) => booking.status === "paid");

  return [
    { label: "Movies", value: movies.length || 5, tone: "blue" },
    { label: "Bookings", value: bookings.length, tone: "cyan" },
    { label: "Paid Orders", value: paidBookings.length, tone: "green" },
    { label: "Revenue", value: formatRupiah(paidBookings.reduce((sum, booking) => sum + booking.total, 0)), tone: "gold" }
  ];
}

function AdminDashboard({ bookings, movies, moviesLoading, stats }) {
  return (
    <div className="admin-stack">
      <section className="admin-stats-grid">
        {stats.map((stat) => (
          <article className={`admin-stat-card ${stat.tone}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-grid-two">
        <AdminCard title="Quick actions">
          <div className="admin-actions">
            <a href="#admin-movies">Add / manage movies</a>
            <a href="#admin-bookings">Review bookings</a>
            <a href="#admin-reports">Open reports</a>
          </div>
        </AdminCard>

        <AdminCard title="System status">
          <StatusRow label="MongoDB" value="Connected template" />
          <StatusRow label="Booking API" value="Active" />
          <StatusRow label="Payment" value="Xendit mock QRIS" />
        </AdminCard>
      </section>

      <section className="admin-grid-two">
        <AdminCard title="Recent bookings">
          <BookingList bookings={bookings.slice(0, 3)} />
        </AdminCard>

        <AdminCard title="Popular movies">
          {moviesLoading ? <p className="admin-muted">Loading movies...</p> : <MovieList movies={movies.slice(0, 4)} />}
        </AdminCard>
      </section>
    </div>
  );
}

function AdminMovies({ movies, moviesLoading, onMovieCreated }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    poster: "",
    description: "",
    slug: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setNewMovie({
      title: "",
      genre: "",
      duration: "",
      rating: "",
      poster: "",
      description: "",
      slug: ""
    });
    setEditingMovie(null);
    setFormError("");
  };

  const startEditMovie = (movie) => {
    setEditingMovie(movie);
    setNewMovie({
      title: movie.title || "",
      genre: movie.genre || movie.genres || "",
      duration: movie.duration || "",
      rating: movie.rating || "",
      poster: movie.poster || "",
      description: movie.description || "",
      slug: movie.slug || ""
    });
    setIsAdding(true);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    const payload = {
      title: newMovie.title,
      genre: newMovie.genre,
      duration: Number(newMovie.duration),
      rating: newMovie.rating,
      poster: newMovie.poster,
      description: newMovie.description,
      slug: newMovie.slug
    };

    try {
      setSubmitting(true);
      if (editingMovie) {
        const movieId = editingMovie.slug || editingMovie._id || editingMovie.id;
        await updateMovie(movieId, payload);
      } else {
        await createMovie(payload);
      }
      setIsAdding(false);
      resetForm();
      onMovieCreated?.();
    } catch (error) {
      setFormError(error.message || "Unable to save movie.");
    } finally {
      setSubmitting(false);
    }
  };

  const promptDeleteMovie = (movie) => {
    setDeleteTarget(movie);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const movieId = deleteTarget.slug || deleteTarget._id || deleteTarget.id;

    try {
      setSubmitting(true);
      await deleteMovie(movieId);
      setDeleteTarget(null);
      onMovieCreated?.();
    } catch (error) {
      window.alert(error.message || "Unable to delete movie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminCard title="Movie catalog">
      <div className="admin-toolbar">
        <input aria-label="Search movies" placeholder="Search movie title" />
        <button type="button" onClick={() => setIsAdding(true)}>
          Add movie
        </button>
      </div>

      {isAdding ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" onClick={() => { setIsAdding(false); resetForm(); }}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-modal-close" onClick={() => { setIsAdding(false); resetForm(); }}>
              ×
            </button>
            <div className="admin-modal-header">
              <h3>{editingMovie ? "Edit movie" : "Add new movie"}</h3>
              <p>{editingMovie ? "Update the movie details." : "Fill in the movie details to create a new catalog entry."}</p>
            </div>
            <form className="admin-movie-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Title
                  <input name="title" value={newMovie.title} onChange={handleFieldChange} required />
                </label>
                <label>
                  Genre
                  <input name="genre" value={newMovie.genre} onChange={handleFieldChange} required />
                </label>
                <label>
                  Duration (minutes)
                  <input name="duration" type="number" min="1" value={newMovie.duration} onChange={handleFieldChange} required />
                </label>
                <label>
                  Rating
                  <input name="rating" value={newMovie.rating} onChange={handleFieldChange} required />
                </label>
                <label>
                  Poster URL
                  <input name="poster" type="url" value={newMovie.poster} onChange={handleFieldChange} required />
                </label>
                <label>
                  Slug
                  <input name="slug" value={newMovie.slug} onChange={handleFieldChange} required />
                </label>
                <label className="admin-form-fullwidth">
                  Description
                  <textarea name="description" value={newMovie.description} onChange={handleFieldChange} rows="4" required />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save movie"}
                </button>
                <button type="button" className="secondary" onClick={() => setIsAdding(false)} disabled={submitting}>
                  Cancel
                </button>
              </div>
              {formError ? <p className="admin-error">{formError}</p> : null}
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" onClick={cancelDelete}>
          <div className="admin-modal admin-confirmation-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-modal-close" onClick={cancelDelete}>
              ×
            </button>
            <div className="admin-modal-header">
              <h3>Delete movie</h3>
              <p>Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This action cannot be undone.</p>
            </div>
            <div className="admin-form-actions">
              <button type="button" onClick={confirmDelete} disabled={submitting}>
                {submitting ? "Deleting..." : "Delete movie"}
              </button>
              <button type="button" className="secondary" onClick={cancelDelete} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {moviesLoading ? <p className="admin-muted">Loading movies...</p> : <MovieTable movies={movies} onEdit={startEditMovie} onDelete={promptDeleteMovie} />}
    </AdminCard>
  );
}

function AdminBookings({ bookings }) {
  return (
    <AdminCard title="All bookings">
      <BookingTable bookings={bookings} />
    </AdminCard>
  );
}

function AdminShowtimes({ movies }) {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    date: "",
    time: "",
    studio: "",
    price: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadShowtimes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getShowtimes();
      setShowtimes(response.showtimes || []);
    } catch (error) {
      setError("Backend unavailable — using sample showtimes.");

      const movieTitleByKey = new Map(
        movies.map((movie) => [movie.slug || movie.id || movie._id, movie.title])
      );

      const sampleShowtimes = showtimeCatalog.map((showtime) => ({
        ...showtime,
        movie: { title: movieTitleByKey.get(showtime.movieKey) || showtime.movieKey }
      }));

      setShowtimes(sampleShowtimes);
    } finally {
      setLoading(false);
    }
  };

  const resetShowtimeForm = () => {
    setNewShowtime({ movieId: "", date: "", time: "", studio: "", price: "" });
    setEditingShowtime(null);
    setFormError("");
  };

  const startEditShowtime = (showtime) => {
    setEditingShowtime(showtime);
    setNewShowtime({
      movieId: showtime.movieId || "",
      date: showtime.date || "",
      time: showtime.time || "",
      studio: showtime.studio || "",
      price: showtime.price != null ? String(showtime.price) : ""
    });
    setIsAdding(true);
  };

  const promptDeleteShowtime = (showtime) => {
    setDeleteTarget(showtime);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteShowtime(deleteTarget.id);
      setDeleteTarget(null);
      await loadShowtimes();
    } catch (error) {
      window.alert(error.message || "Unable to delete showtime.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadShowtimes();
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setNewShowtime((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const payload = {
      movieId: newShowtime.movieId,
      date: newShowtime.date,
      time: newShowtime.time,
      studio: newShowtime.studio,
      price: Number(newShowtime.price)
    };

    try {
      setSubmitting(true);
      if (editingShowtime) {
        await updateShowtime(editingShowtime.id, payload);
      } else {
        await createShowtime(payload);
      }
      setIsAdding(false);
      resetShowtimeForm();
      await loadShowtimes();
    } catch (error) {
      setFormError(error.message || "Unable to save showtime.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminCard title="Showtime catalog">
      <div className="admin-toolbar">
        <input aria-label="Search showtimes" placeholder="Search showtimes" disabled />
        <button type="button" onClick={() => setIsAdding(true)}>
          Add showtime
        </button>
      </div>

      {isAdding ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" onClick={() => { setIsAdding(false); resetShowtimeForm(); }}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-modal-close" onClick={() => { setIsAdding(false); resetShowtimeForm(); }}>
              ×
            </button>
            <div className="admin-modal-header">
              <h3>Add new showtime</h3>
              <p>Link this showtime to a movie and schedule its screening.</p>
            </div>
            <form className="admin-movie-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Movie
                  <select name="movieId" value={newShowtime.movieId} onChange={handleFieldChange} required>
                    <option value="">Select a movie</option>
                    {movies.map((movie) => (
                      <option key={movie.id || movie._id || movie.slug} value={movie.id || movie._id || movie.slug}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Date
                  <input name="date" type="date" value={newShowtime.date} onChange={handleFieldChange} required />
                </label>
                <label>
                  Time
                  <input name="time" type="time" value={newShowtime.time} onChange={handleFieldChange} required />
                </label>
                <label>
                  Studio
                  <input name="studio" value={newShowtime.studio} onChange={handleFieldChange} required />
                </label>
                <label>
                  Price
                  <input name="price" type="number" min="0" value={newShowtime.price} onChange={handleFieldChange} required />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save showtime"}
                </button>
                <button type="button" className="secondary" onClick={() => setIsAdding(false)} disabled={submitting}>
                  Cancel
                </button>
              </div>
              {formError ? <p className="admin-error">{formError}</p> : null}
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" onClick={cancelDelete}>
          <div className="admin-modal admin-confirmation-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-modal-close" onClick={cancelDelete}>
              ×
            </button>
            <div className="admin-modal-header">
              <h3>Delete showtime</h3>
              <p>Are you sure you want to delete <strong>{deleteTarget.movie?.title || "this showtime"}</strong> on {deleteTarget.date} at {deleteTarget.time}?</p>
            </div>
            <div className="admin-form-actions">
              <button type="button" onClick={confirmDelete} disabled={submitting}>
                {submitting ? "Deleting..." : "Delete showtime"}
              </button>
              <button type="button" className="secondary" onClick={cancelDelete} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {loading ? (
        <p className="admin-muted">Loading showtimes...</p>
      ) : (
        <>
          {error ? <p className="admin-error">{error}</p> : null}
          <ShowtimeTable showtimes={showtimes} onEdit={startEditShowtime} onDelete={promptDeleteShowtime} />
        </>
      )}
    </AdminCard>
  );
}

function ShowtimeTable({ showtimes, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Date</th>
            <th>Time</th>
            <th>Studio</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.length ? (
            showtimes.map((showtime) => (
              <tr key={showtime.id}>
                <td>{showtime.movie?.title || "Unknown movie"}</td>
                <td>{showtime.date}</td>
                <td>{showtime.time}</td>
                <td>{showtime.studio}</td>
                <td>{showtime.price ? `Rp${Number(showtime.price).toLocaleString("id-ID")}` : "-"}</td>
                <td>
                  <div className="admin-table-actions">
                    <button type="button" onClick={() => onEdit?.(showtime)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete?.(showtime)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="admin-muted">
                No showtimes available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AdminHalls({ halls }) {
  const [isAdding, setIsAdding] = useState(false);
  const [hallList, setHallList] = useState(halls);
  const [newHall, setNewHall] = useState({
    name: "",
    type: "Regular",
    seats: "",
    status: "Open"
  });
  const [editingHallIndex, setEditingHallIndex] = useState(null);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setHallList(halls);
  }, [halls]);

  const resetHallForm = () => {
    setNewHall({ name: "", type: "Regular", seats: "", status: "Open" });
    setEditingHallIndex(null);
    setFormError("");
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setNewHall((prev) => ({ ...prev, [name]: value }));
  };

  const openEditHall = (index) => {
    const hall = hallList[index];
    setEditingHallIndex(index);
    setNewHall({
      name: hall.name,
      type: hall.type,
      seats: hall.seats,
      status: hall.status
    });
    setIsAdding(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!newHall.name.trim()) {
      setFormError("Hall name is required.");
      return;
    }

    if (!newHall.seats || Number(newHall.seats) < 1) {
      setFormError("Seats must be a positive number.");
      return;
    }

    const updatedHall = {
      name: newHall.name.trim(),
      type: newHall.type,
      seats: Number(newHall.seats),
      status: newHall.status
    };

    if (editingHallIndex !== null) {
      setHallList((current) => current.map((hall, index) => (index === editingHallIndex ? updatedHall : hall)));
    } else {
      setHallList((current) => [...current, updatedHall]);
    }

    setIsAdding(false);
    resetHallForm();
  };

  return (
    <AdminCard
      title="Cinema halls"
      actions={
        <button type="button" onClick={() => setIsAdding(true)}>
          Add studio
        </button>
      }
    >
      {isAdding ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" onClick={() => { setIsAdding(false); resetHallForm(); }}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-modal-close" onClick={() => { setIsAdding(false); resetHallForm(); }}>
              ×
            </button>
            <div className="admin-modal-header">
              <h3>{editingHallIndex !== null ? "Edit studio" : "Add new studio"}</h3>
              <p>Enter the studio details for the cinema hall.</p>
            </div>
            <form className="admin-movie-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Studio name
                  <input name="name" value={newHall.name} onChange={handleFieldChange} required />
                </label>
                <label>
                  Type
                  <select name="type" value={newHall.type} onChange={handleFieldChange}>
                    <option value="Regular">Regular</option>
                    <option value="Premiere">Premiere</option>
                    <option value="IMAX">IMAX</option>
                    <option value="Horror">Horror</option>
                  </select>
                </label>
                <label>
                  Seats
                  <input name="seats" type="number" min="1" value={newHall.seats} onChange={handleFieldChange} required />
                </label>
                <label>
                  Status
                  <select name="status" value={newHall.status} onChange={handleFieldChange}>
                    <option value="Open">Open</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit">Save studio</button>
                <button type="button" className="secondary" onClick={() => { setIsAdding(false); resetHallForm(); }}>
                  Cancel
                </button>
              </div>
              {formError ? <p className="admin-error">{formError}</p> : null}
            </form>
          </div>
        </div>
      ) : null}

      <div className="admin-card-grid">
        {hallList.map((hall, index) => (
          <article className="admin-mini-card" key={`${hall.name}-${index}`}>
            <div className="admin-mini-card-header">
              <span>{hall.type}</span>
              <div className="admin-mini-card-actions">
                <button type="button" onClick={() => openEditHall(index)}>Edit</button>
                <button type="button" className="danger" onClick={() => setDeleteTargetIndex(index)}>Delete</button>
              </div>
            </div>
            <h3>{hall.name}</h3>
            <p>{hall.seats} seats</p>
            <strong>{hall.status}</strong>
          </article>
        ))}
      </div>

      {deleteTargetIndex !== null ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setDeleteTargetIndex(null)}>
          <div className="admin-modal admin-confirmation-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Delete studio?</h3>
              <p>Are you sure you want to remove this studio? This action cannot be undone.</p>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="danger" onClick={() => {
                setHallList((current) => current.filter((_, idx) => idx !== deleteTargetIndex));
                setDeleteTargetIndex(null);
              }}>
                Delete
              </button>
              <button type="button" className="secondary" onClick={() => setDeleteTargetIndex(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminCard>
  );
}

function AdminReports({ bookings, stats }) {
  return (
    <div className="admin-stack">
      <section className="admin-stats-grid">
        {stats.map((stat) => (
          <article className={`admin-stat-card ${stat.tone}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>
      <AdminCard title="Mock sales report">
        <BookingTable bookings={bookings} />
      </AdminCard>
    </div>
  );
}

function AdminCard({ title, actions, children }) {
  return (
    <section className="admin-card">
      {(title || actions) && (
        <div className="admin-card-heading">
          {title ? <h2>{title}</h2> : null}
          {actions ? <div className="admin-card-actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

function BookingList({ bookings }) {
  return (
    <div className="admin-list">
      {bookings.map((booking) => (
        <div key={booking.id}>
          <span>{booking.movie}</span>
          <strong>{booking.id}</strong>
        </div>
      ))}
    </div>
  );
}

function MovieList({ movies }) {
  const displayMovies = movies.length ? movies : [{ title: "Arrival" }, { title: "The Nun" }, { title: "Annabelle" }];

  return (
    <div className="admin-list">
      {displayMovies.map((movie) => (
        <div key={movie.title}>
          <span>{movie.title}</span>
          <strong>{movie.status || "showing"}</strong>
        </div>
      ))}
    </div>
  );
}

function MovieTable({ movies, onEdit, onDelete }) {
  const displayMovies = movies.length ? movies : [{ title: "Arrival", genre: "Sci-Fi", duration: 116, status: "showing" }];

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Genre</th>
            <th>Runtime</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayMovies.map((movie) => (
            <tr key={movie.slug || movie._id || movie.title}>
              <td>
                <div className="admin-movie-cell">
                  {movie.poster ? <img src={movie.poster} alt="" /> : null}
                  <span>{movie.title}</span>
                </div>
              </td>
              <td>{movie.genre || movie.genres}</td>
              <td>{movie.duration ? `${movie.duration} min` : movie.runtime}</td>
              <td>
                <StatusBadge status={movie.status || "showing"} />
              </td>
              <td>
                <div className="admin-table-actions">
                  <button type="button" aria-label={`Edit ${movie.title}`} onClick={() => onEdit?.(movie)}>
                    Edit
                  </button>
                  <button type="button" aria-label={`Delete ${movie.title}`} onClick={() => onDelete?.(movie)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingTable({ bookings }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Customer</th>
            <th>Movie</th>
            <th>Seats</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.customer}</td>
              <td>{booking.movie}</td>
              <td>{booking.seats}</td>
              <td>
                <StatusBadge status={booking.status} />
              </td>
              <td>{formatRupiah(booking.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`admin-badge ${status}`}>{status}</span>;
}

function StatusRow({ label, value }) {
  return (
    <div className="admin-status-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}
