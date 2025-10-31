import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import EventToolbar from "../components/EventToolbar";
import EventTable from "../components/EventTable";
import { exportToCSV } from "../utils/exportCSV";
import "../styles/dashboard.css";

// Keywords for security/expiry type events
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

// ✅ Determine unique key for repeated events
function getEventKey(e) {
  if (e.recurringEventId) return `r:${e.recurringEventId}`;
  if (e.iCalUID) return `i:${e.iCalUID}`;
  if (e.id) return `id:${e.id}`;

  const s = e.summary || "";
  const start = e.start?.dateTime || e.start?.date || "";
  const end = e.end?.dateTime || e.end?.date || "";
  return `f:${s}|${start}|${end}`;
}

// ✅ Deduplicate events (keep earliest occurrence)
function uniqueByKey(events) {
  const map = new Map();

  for (const ev of events) {
    const key = getEventKey(ev);

    if (!map.has(key)) {
      map.set(key, ev);
      continue;
    }

    const existing = map.get(key);
    const existingStart = new Date(
      existing.start.dateTime || existing.start.date
    ).getTime();
    const newStart = new Date(ev.start.dateTime || ev.start.date).getTime();

    if (newStart < existingStart) {
      map.set(key, ev);
    }
  }
  return Array.from(map.values());
}

export default function Dashboard() {
  const { events, fetchEvents, user, loading, error } = useAuth();

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keywordOnly, setKeywordOnly] = useState(false);
  const [endBefore, setEndBefore] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (user || localStorage.getItem("token")) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  const isKeywordEvent = (e) => {
    const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();
    return KEYWORDS.some((k) => text.includes(k));
  };

  // ✅ Filtering logic
  const filtered = useMemo(() => {
    if (!events) return [];

    const uniqueEvents = uniqueByKey(events);

    return uniqueEvents.filter((e) => {
      const s = search.toLowerCase();
      const start = new Date(e.start.dateTime || e.start.date);
      const end = new Date(e.end.dateTime || e.end.date);

      const matchesText =
        (e.summary || "").toLowerCase().includes(s) ||
        (e.organizer?.email || "").toLowerCase().includes(s);

      const afterStart = !dateFrom || start >= new Date(dateFrom);
      const beforeStart = !dateTo || start <= new Date(dateTo);

      // ✅ NEW: show events where end <= selected end date
      const beforeEndCutoff = !endBefore || end <= new Date(endBefore);

      const keywordPass = !keywordOnly || isKeywordEvent(e);

      return (
        matchesText &&
        afterStart &&
        beforeStart &&
        beforeEndCutoff &&
        keywordPass
      );
    });
  }, [events, search, dateFrom, dateTo, endBefore, keywordOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const renderContent = () => {
    if (loading && events.length === 0)
      return <div className="dashboard-message">Loading events...</div>;

    if (error)
      return (
        <div className="dashboard-message error">
          Error: {error}. Please try logging in again.
        </div>
      );

    if (events.length === 0)
      return (
        <div className="dashboard-message">
          No events found in your calendar.
        </div>
      );

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
          meetingsOnly={keywordOnly}
          setMeetingsOnly={setKeywordOnly}
          endBefore={endBefore}
          setEndBefore={setEndBefore}
          exportCSV={() => exportToCSV(filtered)}
        />

        {endBefore && (
          <div className="info-tag">
            Showing events ending on or before: <b>{endBefore}</b>
          </div>
        )}

        {renderContent()}
      </div>
    </>
  );
}
