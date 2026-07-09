const rows = ["A", "B", "C", "D", "E", "F"];
const seatsPerRow = 8;

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const seatLayout = {
  rows,
  seatsPerRow
};

export const showtimeCatalog = [
  {
    id: "local-breaking-dawn-1",
    movieKey: "breaking-dawn-part-2",
    date: dateOffset(1),
    time: "13:30",
    studio: "Hall IMAX",
    price: 35000,
    bookedSeats: ["A4", "B2", "C7", "D3", "E8"]
  },
  {
    id: "local-breaking-dawn-2",
    movieKey: "breaking-dawn-part-2",
    date: dateOffset(1),
    time: "19:40",
    studio: "Studio 2",
    price: 40000,
    bookedSeats: ["A1", "A2", "B6", "C3", "F8"]
  },
  {
    id: "local-breaking-dawn-expired",
    movieKey: "breaking-dawn-part-2",
    date: dateOffset(-1),
    time: "10:30",
    studio: "Studio 1",
    price: 30000,
    bookedSeats: ["A3", "B4"]
  },
  {
    id: "local-another-earth-1",
    movieKey: "another-earth",
    date: dateOffset(2),
    time: "11:15",
    studio: "Studio 3",
    price: 30000,
    bookedSeats: ["C4", "C5", "D4"]
  },
  {
    id: "local-another-earth-2",
    movieKey: "another-earth",
    date: dateOffset(2),
    time: "17:00",
    studio: "Studio 2",
    price: 35000,
    bookedSeats: ["A8", "B8", "F1"]
  },
  {
    id: "local-arrival-1",
    movieKey: "arrival",
    date: dateOffset(1),
    time: "14:20",
    studio: "Hall IMAX",
    price: 45000,
    bookedSeats: ["A5", "A6", "B5", "B6", "E2"]
  },
  {
    id: "local-arrival-2",
    movieKey: "arrival",
    date: dateOffset(3),
    time: "20:10",
    studio: "Studio 4",
    price: 40000,
    bookedSeats: ["C1", "D1", "E1"]
  },
  {
    id: "local-annabelle-1",
    movieKey: "annabelle",
    date: dateOffset(1),
    time: "21:30",
    studio: "Studio Horror",
    price: 40000,
    bookedSeats: ["A1", "A2", "A3", "B2", "C2", "D2"]
  }
];

export function buildLocalSeatAvailability(bookedSeats = []) {
  const bookedSeatSet = new Set(bookedSeats);

  return rows.map((row) => ({
    row,
    seats: Array.from({ length: seatsPerRow }, (_, index) => {
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
