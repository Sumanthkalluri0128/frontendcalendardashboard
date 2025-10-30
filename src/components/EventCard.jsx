import { Calendar, Clock, User } from "lucide-react";

export default function EventCard({ event }) {
  const start = new Date(event.start.dateTime || event.start.date);
  const end = new Date(event.end.dateTime || event.end.date);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition flex justify-between items-center">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {event.summary || "(No Title)"}
        </h3>

        <div className="text-sm text-gray-600 space-y-1">
          <p className="flex items-center gap-2">
            <Clock size={16} />
            {start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" - "}
            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>

          <p className="flex items-center gap-2">
            <User size={16} /> {event.organizer?.email || "Unknown"}
          </p>
        </div>
      </div>

      <a
        href={event.htmlLink}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        View
      </a>
    </div>
  );
}
