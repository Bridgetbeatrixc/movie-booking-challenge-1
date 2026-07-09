import { formatCurrency, formatShowDate, formatShowTime, isPastShowtime } from "../../utils/formatters.js";

function groupShowtimes(showtimes) {
  return showtimes.reduce((groups, showtime) => {
    const key = showtime.date;
    groups[key] = groups[key] || [];
    groups[key].push(showtime);
    return groups;
  }, {});
}

export function ShowtimeList({ error, loading, onRetry, onSelect, selectedShowtimeId, showtimes }) {
  const groupedShowtimes = groupShowtimes(showtimes);
  const dates = Object.keys(groupedShowtimes).sort();

  return (
    <section className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">Showtime</p>
          <h2 className="text-xl font-semibold">Choose schedule</h2>
        </div>
        {error ? (
          <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-4 rounded-lg border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
          Loading showtimes...
        </p>
      ) : error ? (
        <p className="mt-4 rounded-lg border border-red-400/40 bg-red-950/40 p-4 text-sm text-red-100">{error}</p>
      ) : dates.length === 0 ? (
        <p className="mt-4 rounded-lg border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
          No showtime is available for this movie.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {dates.map((date) => (
            <div key={date}>
              <p className="mb-2 text-sm font-semibold text-blue-200">{formatShowDate(date)}</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {groupedShowtimes[date].map((showtime) => {
                  const selected = selectedShowtimeId === showtime.id;
                  const expired = isPastShowtime(showtime);

                  return (
                    <button
                      className={`showtime-card rounded-lg border p-3 text-left transition ${
                        selected
                          ? "border-blue-400 bg-blue-600/40"
                          : "border-slate-700 bg-slate-900/30 hover:border-blue-300"
                      } ${expired ? "opacity-50" : ""}`}
                      disabled={expired}
                      key={showtime.id}
                      onClick={() => onSelect(showtime)}
                      type="button"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <strong className="text-lg">{formatShowTime(showtime.time)}</strong>
                        <span className="rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                          {expired ? "Ended" : "Open"}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-slate-300">{showtime.studio}</span>
                      <span className="mt-2 block text-sm font-semibold text-blue-200">
                        {formatCurrency(showtime.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
