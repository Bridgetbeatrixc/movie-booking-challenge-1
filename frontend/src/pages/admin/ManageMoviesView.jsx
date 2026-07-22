import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Film, Clock, HelpCircle, Check, Info } from 'lucide-react';
import BackendBlueprint from './BackendBlueprint';

const GENRE_PRESETS = ['Action', 'Adventure', 'Sci-Fi', 'Thriller', 'Cyberpunk', 'Drama', 'Mystery', 'Animation', 'Fantasy', 'Family', 'Horror', 'Comedy', 'Romance'];

const POSTER_PRESETS = [
  { name: 'Space/Sci-Fi', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80' },
  { name: 'Cyberpunk/Neon', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&auto=format&fit=crop&q=80' },
  { name: 'Classic/Drama', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop&q=80' },
  { name: 'Abstract/Magic', url: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&auto=format&fit=crop&q=80' },
  { name: 'Moody/Thriller', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80' },
];

export default function ManageMoviesView({
  movies,
  onAddMovie,
  onEditMovie,
  onDeleteMovie
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [genreString, setGenreString] = useState('');
  const [duration, setDuration] = useState(120);
  const [rating, setRating] = useState('PG-13');
  const [synopsis, setSynopsis] = useState('');
  const [posterUrl, setPosterUrl] = useState(POSTER_PRESETS[0].url);
  const [releaseDate, setReleaseDate] = useState('2026-07-09');
  const [language, setLanguage] = useState('English');
  const [isActive, setIsActive] = useState(true);

  // Open form for adding
  const handleOpenAddForm = () => {
    setEditingMovie(null);
    setTitle('');
    setGenreString('');
    setDuration(120);
    setRating('PG-13');
    setSynopsis('');
    setPosterUrl(POSTER_PRESETS[0].url);
    setReleaseDate('2026-07-09');
    setLanguage('English');
    setIsActive(true);
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleOpenEditForm = (movie) => {
    setEditingMovie(movie);
    setTitle(movie.title);
    setGenreString(movie.genre.join(', '));
    setDuration(movie.duration);
    setRating(movie.rating);
    setSynopsis(movie.synopsis);
    setPosterUrl(movie.posterUrl);
    setReleaseDate(movie.releaseDate);
    setLanguage(movie.language);
    setIsActive(movie.isActive);
    setIsFormOpen(true);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const genres = genreString
      .split(',')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    const movieData = {
      title: title.trim(),
      genre: genres.length > 0 ? genres : ['Drama'],
      duration: Number(duration) || 120,
      rating,
      synopsis: synopsis.trim(),
      posterUrl: posterUrl.trim(),
      releaseDate,
      language: language.trim(),
      isActive
    };

    if (editingMovie) {
      onEditMovie({ ...movieData, id: editingMovie.id });
    } else {
      onAddMovie(movieData);
    }
    setIsFormOpen(false);
  };

  // Preset Poster Click Handler
  const handleSelectPosterPreset = (url) => {
    setPosterUrl(url);
  };

  // Quick Genre Suggestion Handler
  const handleGenreSuggest = (genre) => {
    if (genreString === '') {
      setGenreString(genre);
    } else {
      const existing = genreString.split(',').map(g => g.trim());
      if (!existing.includes(genre)) {
        setGenreString(prev => `${prev}, ${genre}`);
      }
    }
  };

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          movie.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div id="manage-movies-container" className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Manage Movies</h2>
          <p className="text-gray-400 text-xs">Register new cinematic releases, configure meta-details, and manage listings.</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="bg-hotstar-accent hover:bg-opacity-95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-hotstar-accent/15 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-hotstar-card rounded-xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search catalog by title, synopsis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-hotstar-bg text-sm rounded-lg border border-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-hotstar-accent/50 transition-colors"
          />
        </div>

        {/* Genre Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-gray-400 font-medium">Genre:</span>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-hotstar-bg text-xs border border-gray-800 text-gray-200 py-2 px-3.5 rounded-lg focus:outline-none focus:border-hotstar-accent"
          >
            <option value="All">All Genres</option>
            {GENRE_PRESETS.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Dialog Panel (Modal style) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-hotstar-card border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-hotstar-sidebar">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-hotstar-accent/10 rounded-lg text-hotstar-accent">
                  <Film size={18} />
                </div>
                <h3 className="font-semibold text-white text-base">
                  {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie Entry'}
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Movie Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inception Reloaded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  />
                </div>

                {/* Genre Field with Helper tag */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Genres <span className="text-gray-500">(Comma separated or click suggestions below)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Action, Sci-Fi, Thriller"
                    value={genreString}
                    onChange={(e) => setGenreString(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {GENRE_PRESETS.slice(0, 7).map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleGenreSuggest(g)}
                        className="text-[10px] bg-white/5 hover:bg-hotstar-accent/20 border border-white/10 hover:border-hotstar-accent/30 text-gray-300 rounded px-2 py-0.5 transition-colors"
                      >
                        + {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Duration <span className="text-gray-500">(Minutes)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Parental Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  >
                    <option value="G">G - General Audience</option>
                    <option value="PG">PG - Parental Guidance</option>
                    <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                    <option value="R">R - Restricted</option>
                    <option value="18+">18+ - Adults Only</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    required
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  />
                </div>

                {/* Release Date */}
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    required
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  />
                </div>

                {/* Poster URL presets */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Poster Image URL <span className="text-gray-500">(Choose preset or paste link)</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent font-mono text-xs"
                  />
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {POSTER_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectPosterPreset(preset.url)}
                        className={`p-1 bg-hotstar-bg rounded border hover:border-hotstar-accent/50 transition-all ${
                          posterUrl === preset.url ? 'border-hotstar-accent ring-1 ring-hotstar-accent/50' : 'border-gray-800'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-12 object-cover rounded" />
                        <span className="text-[8px] text-gray-400 truncate block mt-0.5 text-center">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Synopsis */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    Synopsis / Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter movie narrative plot..."
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="w-full bg-hotstar-bg border border-gray-800 px-3 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-hotstar-accent"
                  ></textarea>
                </div>

                {/* Active Switch */}
                <div className="md:col-span-2 flex items-center space-x-3 bg-hotstar-bg/40 p-3 rounded-lg border border-gray-800">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-hotstar-accent bg-hotstar-bg border-gray-800 rounded focus:ring-hotstar-accent focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-xs text-gray-300 font-medium select-none">
                    Listed/Active in Booking (Make visible to schedule showtimes)
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-hotstar-accent hover:bg-opacity-90 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Check size={14} />
                  <span>{editingMovie ? 'Save Changes' : 'Register Movie'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid List of Movies */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="bg-hotstar-card rounded-xl border border-gray-800/80 overflow-hidden hover:border-gray-700/80 transition-all duration-300 flex flex-col group relative"
          >
            {/* Poster Header */}
            <div className="relative h-56 overflow-hidden bg-black shrink-0">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hotstar-card via-transparent to-transparent"></div>
              
              {/* Top Bar Badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="bg-black/75 backdrop-blur-sm border border-white/10 text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                  {movie.rating}
                </span>
                <span className="bg-hotstar-accent/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                  {movie.language}
                </span>
              </div>

              {/* Active Badge */}
              <div className="absolute top-3 right-3">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
                  movie.isActive ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                }`}>
                  {movie.isActive ? 'Listed' : 'Archived'}
                </span>
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-hotstar-accent transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                
                {/* Duration & Date */}
                <div className="flex items-center space-x-3 text-[10px] text-gray-400 mt-1.5 font-mono">
                  <span className="flex items-center"><Clock size={11} className="mr-1 text-hotstar-accent" /> {movie.duration}m</span>
                  <span>Released: {new Date(movie.releaseDate).toLocaleDateString([], { year: 'numeric', month: 'short' })}</span>
                </div>

                {/* Genre Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {movie.genre.map((g, i) => (
                    <span key={i} className="bg-white/5 text-gray-300 text-[9px] font-medium px-2 py-0.5 rounded">
                      {g}
                    </span>
                  ))}
                </div>

                {/* Plot Snippet */}
                <p className="text-[11px] text-gray-400 mt-3.5 line-clamp-2 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Action bar */}
              <div className="mt-5 pt-3.5 border-t border-gray-800/80 flex items-center justify-between">
                <span className="text-[9px] text-gray-500 font-mono">ID: {movie.id.slice(0, 8)}...</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEditForm(movie)}
                    className="p-1.5 bg-white/5 hover:bg-hotstar-accent/20 border border-white/10 hover:border-hotstar-accent/20 text-gray-300 hover:text-white rounded-md transition-colors"
                    title="Edit Movie details"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => onDeleteMovie(movie.id)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-md transition-colors"
                    title="Delete Movie"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredMovies.length === 0 && (
          <div className="col-span-full p-12 bg-hotstar-card/30 rounded-xl border border-dashed border-gray-800 text-center flex flex-col items-center justify-center">
            <Film className="text-gray-500 mb-3" size={32} />
            <h4 className="text-sm font-semibold text-white">No Movies Found</h4>
            <p className="text-gray-400 text-xs mt-1">Adjust search filter or register a new movie to start scheduling.</p>
          </div>
        )}
      </div>

      {/* Backend Blueprint */}
      <BackendBlueprint scope="movies" />
    </div>
  );
}