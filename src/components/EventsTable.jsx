import React from "react";
function dateStr(dt) {
  if (!dt) return "";
  if (dt.dateTime) return new Date(dt.dateTime).toLocaleString();
  if (dt.date) return new Date(dt.date).toLocaleDateString();
  return "";
}
export default function EventsTable({ events }) {
  if (!events || events.length === 0) return <p>No events found.</p>;
  return (
    <table className="events-table">
      <thead>
        <tr>
          <th>Summary</th>
          <th>Start</th>
          <th>End</th>
          <th>Attendees</th>
          <th>Organizer</th>
        </tr>
      </thead>
      <tbody>
        {events.map((ev) => (
          <tr key={ev.id}>
            <td>{ev.summary || "(no title)"}</td>
            <td>{dateStr(ev.start)}</td>
            <td>{dateStr(ev.end)}</td>
            <td>{(ev.attendees || []).map((a) => a.email).join(", ")}</td>
            <td>
              {ev.organizer && (ev.organizer.email || ev.organizer.displayName)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
