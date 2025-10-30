export default function MiniCalendar({ events }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="font-semibold mb-2">Upcoming Events</h3>
      <ul className="space-y-2 text-sm">
        {events.slice(0, 10).map((e) => (
          <li key={e.id} className="flex justify-between">
            <span>
              {new Date(e.start.dateTime || e.start.date).toLocaleDateString()}
            </span>
            <span>{e.summary?.slice(0, 18) || "No Title"}...</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
