import { bookingDates, cinemas, showtimes } from "../../constants/booking";

export function BookingOptions() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      <DatePicker />
      <CinemaPicker />
      <ShowtimePicker />
    </section>
  );
}

function DatePicker() {
  return (
    <div className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
      <p className="text-sm text-slate-400">Select date</p>
      <div className="mt-3 flex gap-2">
        {bookingDates.map((date, index) => {
          const [day, number] = date.split(" ");
          return (
            <button
              key={date}
              className={`rounded-lg border px-3 py-2 text-sm ${
                index === 0 ? "border-blue-400 bg-blue-600" : "border-slate-700"
              }`}
            >
              {day}
              <br />
              <b>{number}</b>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CinemaPicker() {
  return (
    <div className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
      <p className="text-sm text-slate-400">Select cinema</p>
      <select className="mt-3 w-full rounded-lg border border-slate-600 bg-[#0a2140] p-3 text-sm">
        {cinemas.map((cinema) => (
          <option key={cinema}>{cinema}</option>
        ))}
      </select>
    </div>
  );
}

function ShowtimePicker() {
  return (
    <div className="rounded-xl border border-slate-700 bg-[#06152d] p-5">
      <p className="text-sm text-slate-400">Select showtime</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {showtimes.map((showtime, index) => (
          <button
            key={showtime}
            className={`rounded-lg border px-3 py-2 text-sm ${
              index === 1 ? "border-blue-400 bg-blue-600" : "border-slate-600"
            }`}
          >
            {showtime}
          </button>
        ))}
      </div>
    </div>
  );
}
