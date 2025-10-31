import { ExternalLink, Clock, User, Calendar } from "lucide-react";

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function EventTable({ events }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Time</th>
            <th>Event</th>
            <th>Organizer</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "18px" }}>
                No events found
              </td>
            </tr>
          )}

          {events.map((event) => {
            const startRaw = event.start.dateTime || event.start.date;
            const endRaw = event.end.dateTime || event.end.date;

            const start = new Date(startRaw);
            const end = new Date(endRaw);

            const isAllDay = !event.start.dateTime; // Google uses `date` for all-day events

            return (
              <tr key={event.id}>
                {/* ✅ START DATE */}
                <td>
                  <Calendar size={14} /> {formatDate(start)}
                </td>

                {/* ✅ END DATE */}
                <td>
                  <Calendar size={14} /> {formatDate(end)}
                </td>

                {/* ✅ TIME */}
                <td>
                  {isAllDay ? (
                    "All Day"
                  ) : (
                    <>
                      <Clock size={14} />{" "}
                      {start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </td>

                {/* ✅ EVENT NAME */}
                <td>{event.summary || "(No Title)"}</td>

                {/* ✅ ORGANIZER */}
                <td>
                  <User size={14} /> {event.organizer?.email}
                </td>

                {/* ✅ OPEN LINK */}
                <td>
                  <a href={event.htmlLink} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} /> Open
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
