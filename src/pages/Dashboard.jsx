import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import EventToolbar from "../components/EventToolbar";
import EventTable from "../components/EventTable";
import { exportToCSV } from "../utils/exportCSV";
import "../styles/dashboard.css";
const KEYWORDS = [
  "expire",
  "expired",
  "expiry",
  "renewal",
  "renew",
  "password",
  "expiring",
  "cert",
  "certificate",
  "certs",
];
export default function Dashboard() {
  const { events, fetchEvents, user, loading, error } = useAuth();

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [meetingsOnly, setMeetingsOnly] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (user || localStorage.getItem("token")) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  const isKeywordEvent = (e) => {
    const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();

    // substring match (partial allowed)
    return KEYWORDS.some((keyword) => text.includes(keyword));
  };

  const isMeeting = (e) => {
    const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();

    return KEYWORDS.some((keyword) => text.includes(keyword));
  };

  let filtered = events.filter((e) => {
    const s = search.toLowerCase();
    const date = new Date(e.start.dateTime || e.start.date || 0);

    return (
      (e.summary?.toLowerCase().includes(s) ||
        e.organizer?.email?.toLowerCase().includes(s)) &&
      (!dateFrom || date >= new Date(dateFrom)) &&
      (!dateTo || date <= new Date(dateTo))
    );
  });

  if (meetingsOnly) filtered = filtered.filter(isKeywordEvent);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
