import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Make sure this path is correct
import Header from "../components/Header";
import EventToolbar from "../components/EventToolbar";
import EventTable from "../components/EventTable";
import { exportToCSV } from "../utils/exportCSV";
import "../styles/dashboard.css";

export default function Dashboard() {
  // Add loading and error from the context
  const { events, fetchEvents, user, loading, error } = useAuth();

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [meetingsOnly, setMeetingsOnly] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    // Only fetch events if we have a user
    if (user) {
      fetchEvents();
    }
  }, [user]); // Re-run if the user object changes

  const isMeeting = (e) =>
    e?.attendees?.some((a) => a.email === user?.email) &&
    e?.organizer?.email !== user?.email;

  let filtered = events.filter((e) => {
    const s = search.toLowerCase();
    const date = new Date(e.start.dateTime || e.start.date);

    return (
      (e.summary?.toLowerCase().includes(s) ||
        e.organizer?.email?.toLowerCase().includes(s)) &&
      (!dateFrom || date >= new Date(dateFrom)) &&
      (!dateTo || date <= new Date(dateTo))
    );
  });

  if (meetingsOnly) filtered = filtered.filter(isMeeting);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // --- ADD LOADING AND ERROR UI ---
  const renderContent = () => {
    if (loading && events.length === 0) {
      return <div className="dashboard-message">Loading events...</div>;
    }

    if (error) {
      return (
        <div className="dashboard-message error">
          Error: {error}. Please try logging in again.
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="dashboard-message">
          No events found in your calendar.
        </div>
      );
    }

    return (
      <>
        <EventTable events={paginated} />
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <EventToolbar
          search={search}
          setSearch={setSearch}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          meetingsOnly={meetingsOnly}
          setMeetingsOnly={setMeetingsOnly}
          exportCSV={() => exportToCSV(filtered)}
        />
        
        {renderContent()}
      </div>
    </>
  );
}
