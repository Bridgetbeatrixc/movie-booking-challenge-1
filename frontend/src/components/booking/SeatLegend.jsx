const items = [
  { label: "Available", className: "bg-slate-700" },
  { label: "Selected", className: "bg-blue-500" },
  { label: "Booked", className: "bg-slate-900 border border-slate-600" }
];

export function SeatLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-400" aria-label="Seat status legend">
      {items.map((item) => (
        <span className="inline-flex items-center gap-1.5" key={item.label}>
          <i className={`inline-block h-3 w-3 rounded ${item.className}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
