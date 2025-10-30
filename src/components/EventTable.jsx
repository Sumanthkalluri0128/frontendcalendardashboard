import { ExternalLink, Clock, User } from "lucide-react";

export default function EventTable({ events }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Event</th>
            <th>Organizer</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "18px" }}>
                No events found
              </td>
            </tr>
          )}

          {events.map((event) => {
            const start = new Date(event.start.dateTime || event.start.date);
            const end = new Date(event.end.dateTime || event.end.date);

            return (
              <tr key={event.id}>
                <td>
                  {start.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>
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
