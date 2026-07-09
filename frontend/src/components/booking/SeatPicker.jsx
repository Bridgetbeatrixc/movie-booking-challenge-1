import { occupiedSeats, seatRows } from "../../constants/booking";

export function SeatPicker({ selectedSeats, toggleSeat }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#06152d] p-5 sm:p-8">
      <SeatPickerHeader />
      <div className="mx-auto mt-9 max-w-xl">
        <div className="rounded-[50%] border-t-4 border-blue-300/80 pt-3 text-center text-xs font-semibold tracking-[.45em] text-blue-100">
          SCREEN
        </div>
        <div className="mt-8 space-y-3">
          {seatRows.map((row) => (
            <SeatRow key={row} row={row} selectedSeats={selectedSeats} toggleSeat={toggleSeat} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SeatPickerHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold">Select your seats</h2>
        <p className="mt-1 text-sm text-slate-400">Rp35.000 per seat</p>
      </div>
      <div className="flex gap-3 text-xs text-slate-400">
        <SeatLegend color="bg-slate-600" label="Available" />
        <SeatLegend color="bg-blue-500" label="Selected" />
        <SeatLegend color="bg-slate-700" label="Occupied" />
      </div>
    </div>
  );
}

function SeatLegend({ color, label }) {
  return (
    <span>
      <i className={`mr-1 inline-block h-3 w-3 rounded ${color}`} />
      {label}
    </span>
  );
}

function SeatRow({ row, selectedSeats, toggleSeat }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-center text-sm text-slate-400">{row}</span>
      {Array.from({ length: 8 }, (_, index) => {
        const seatName = `${row}${index + 1}`;
        const occupied = occupiedSeats.includes(seatName);
        const selected = selectedSeats.includes(seatName);

        return (
          <button
            key={seatName}
            disabled={occupied}
            onClick={() => toggleSeat(seatName)}
            className={`seat h-8 flex-1 rounded border border-slate-600 bg-slate-700 text-xs transition hover:border-blue-300 hover:bg-slate-600 ${
              occupied ? "occupied" : ""
            } ${selected ? "selected" : ""}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
