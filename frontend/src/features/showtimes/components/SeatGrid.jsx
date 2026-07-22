import { useEffect, useRef } from "react";
import { SeatLegend } from "./SeatLegend.jsx";

export function SeatGrid({
  availability,
  error,
  loading,
  onRetry,
  onSetSeatSelection,
  onToggleSeat,
  selectedSeats,
  showtime
}) {
  const dragStateRef = useRef({ active: false, shouldSelect: true, touchedSeats: new Set() });
  const selectedSeatsRef = useRef(new Set(selectedSeats));
  const hasSeats = availability?.length > 0;

  useEffect(() => {
    selectedSeatsRef.current = new Set(selectedSeats);
  }, [selectedSeats]);

  function applySeat(seatId, shouldSelect) {
    const dragState = dragStateRef.current;

    if (dragState.touchedSeats.has(seatId)) {
      return;
    }

    dragState.touchedSeats.add(seatId);

    const nextSelectedSeats = new Set(selectedSeatsRef.current);
    if (shouldSelect) {
      nextSelectedSeats.add(seatId);
    } else {
      nextSelectedSeats.delete(seatId);
    }

    selectedSeatsRef.current = nextSelectedSeats;
    onSetSeatSelection(seatId, shouldSelect);
  }

  function startSeatDrag(seat, booked, event) {
    if (booked) {
      return;
    }

    event.preventDefault();

    const shouldSelect = !selectedSeatsRef.current.has(seat.id);
    dragStateRef.current = { active: true, shouldSelect, touchedSeats: new Set() };
    applySeat(seat.id, shouldSelect);
  }

  function continueSeatDrag(seat, booked) {
    const dragState = dragStateRef.current;

    if (!dragState.active || booked) {
      return;
    }

    applySeat(seat.id, dragState.shouldSelect);
  }

  function endSeatDrag() {
    dragStateRef.current.active = false;
    dragStateRef.current.touchedSeats.clear();
  }

  function handleKeyboardToggle(seatId, event) {
    if (event.detail === 0) {
      onToggleSeat(seatId);
    }
  }

  return (
    <section className="rounded-xl border border-slate-700 bg-[#06152d] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Select your seats</h2>
          <p className="mt-1 text-sm text-slate-400">{showtime ? `${showtime.studio} seats` : "Choose a showtime first"}</p>
        </div>
        <SeatLegend />
      </div>

      {loading ? (
        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-900/40 p-8 text-center text-sm text-slate-300">
          Loading latest seat availability...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-lg border border-red-400/40 bg-red-950/40 p-5 text-sm text-red-100">
          <p>{error}</p>
          <button className="mt-3 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white" onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : !showtime ? (
        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
          No showtime selected.
        </div>
      ) : !hasSeats ? (
        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
          Seat data is empty.
        </div>
      ) : (
        <div className="mx-auto mt-9 max-w-xl">
          <div className="rounded-[50%] border-t-4 border-blue-300/80 pt-3 text-center text-xs font-semibold tracking-[.45em] text-blue-100">
            SCREEN
          </div>
          <div className="mt-8 space-y-3 select-none" onPointerCancel={endSeatDrag} onPointerUp={endSeatDrag}>
            {availability.map((row) => (
              <div className="grid grid-cols-[24px_repeat(8,minmax(28px,1fr))] items-center gap-2" key={row.row}>
                <span className="text-center text-sm text-slate-400">{row.row}</span>
                {row.seats.map((seat) => {
                  const booked = seat.status === "booked";
                  const selected = selectedSeats.includes(seat.id);

                  return (
                    <button
                      aria-pressed={selected}
                      className={`seat h-9 rounded border border-slate-600 bg-slate-700 text-xs transition hover:border-blue-300 hover:bg-slate-600 ${
                        booked ? "booked" : ""
                      } ${selected ? "selected" : ""}`}
                      disabled={booked}
                      key={seat.id}
                      onClick={(event) => handleKeyboardToggle(seat.id, event)}
                      onPointerCancel={endSeatDrag}
                      onPointerDown={(event) => startSeatDrag(seat, booked, event)}
                      onPointerEnter={() => continueSeatDrag(seat, booked)}
                      onPointerUp={endSeatDrag}
                      title={booked ? `${seat.id} is already booked` : seat.id}
                      type="button"
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
