export const DEFAULT_SEAT_LAYOUT = {
  rows: ["A", "B", "C", "D", "E", "F"],
  seatsPerRow: 8
};

export function buildSeatIds(layout = DEFAULT_SEAT_LAYOUT) {
  return layout.rows.flatMap((row) =>
    Array.from({ length: layout.seatsPerRow }, (_, index) => `${row}${index + 1}`)
  );
}

export function normalizeSeatId(seatId) {
  return String(seatId || "")
    .trim()
    .toUpperCase();
}

export function validateSeatSelection(seats = [], layout = DEFAULT_SEAT_LAYOUT) {
  const validSeatIds = new Set(buildSeatIds(layout));
  const normalizedSeats = seats.map(normalizeSeatId).filter(Boolean);
  const seen = new Set();
  const duplicateSeats = [];
  const invalidSeats = [];

  for (const seat of normalizedSeats) {
    if (!validSeatIds.has(seat)) {
      invalidSeats.push(seat);
      continue;
    }

    if (seen.has(seat)) {
      duplicateSeats.push(seat);
      continue;
    }

    seen.add(seat);
  }

  return {
    seats: [...seen],
    duplicateSeats,
    invalidSeats,
    isValid: duplicateSeats.length === 0 && invalidSeats.length === 0
  };
}

export function getSeatConflicts(requestedSeats = [], bookedSeats = []) {
  const bookedSeatSet = new Set(bookedSeats.map(normalizeSeatId));
  return requestedSeats.map(normalizeSeatId).filter((seat) => bookedSeatSet.has(seat));
}

export function buildSeatAvailability(bookedSeats = [], layout = DEFAULT_SEAT_LAYOUT) {
  const bookedSeatSet = new Set(bookedSeats.map(normalizeSeatId));

  return layout.rows.map((row) => ({
    row,
    seats: Array.from({ length: layout.seatsPerRow }, (_, index) => {
      const id = `${row}${index + 1}`;

      return {
        id,
        row,
        number: index + 1,
        status: bookedSeatSet.has(id) ? "booked" : "available"
      };
    })
  }));
}
