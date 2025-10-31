import { ExternalLink, Clock, User } from "lucide-react";

export default function EventTable({ events }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
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
            const start = event.start?.dateTime || event.start?.date;
            const end = event.end?.dateTime || event.end?.date;

            return (
              <tr key={event.id}>
                <td>{formatDate(start)}</td>
                <td>{formatDate(end)}</td>
                <td>
                  <Clock size={14} /> {formatTime(start)} – {formatTime(end)}
                </td>
                <td>{event.summary || "(No Title)"}</td>
                <td>
                  <User size={14} /> {event.organizer?.email}
                </td>
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
