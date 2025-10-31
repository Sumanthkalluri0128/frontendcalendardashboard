import { useEffect, useState, useMemo } from "react";
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

// ✅ robust dedupe key resolver
function getEventKey(e) {
  if (e.recurringEventId) return `r:${e.recurringEventId}`;
  if (e.iCalUID) return `i:${e.iCalUID}`;
  if (e.id) return `id:${e.id}`;

  // fallback
  const s = e.summary || "";
  const startRaw = e.start?.dateTime || e.start?.date || "";
  const endRaw = e.end?.dateTime || e.end?.date || "";
  return `f:${s}|${startRaw}|${endRaw}`;
}

// ✅ dedupe multi-day & recurring properly
function uniqueByKey(events) {
  const map = new Map();

  for (const ev of events) {
    const key = getEventKey(ev);

    if (!map.has(key)) {
      map.set(key, ev);
      continue;
    }

    // already have one — keep earliest start
    const existing = map.get(key);
    const existingStart = new Date(
      existing.start?.dateTime || existing.start?.date || 0
    ).getTime();
    const newStart = new Date(
      ev.start?.dateTime || ev.start?.date || 0
    ).getTime();

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

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (user || localStorage.getItem("token")) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  // ✅ keyword detector
  const isKeywordEvent = (e) => {
    const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();
    return KEYWORDS.some((keyword) => text.includes(keyword));
  };

  // ✅ prepare deduped & filtered events
  const filtered = useMemo(() => {
    if (!events) return [];

    const uniqueEvents = uniqueByKey(events);

    return uniqueEvents.filter((e) => {
      const s = search.toLowerCase();
      const textMatch =
        (e.summary || "").toLowerCase().includes(s) ||
        (e.organizer?.email || "").toLowerCase().includes(s);

      const date = new Date(e.start.dateTime || e.start.date || 0);
      const fromOK = !dateFrom || date >= new Date(dateFrom);
      const toOK = !dateTo || date <= new Date(dateTo);

      const keywordOK = !keywordOnly || isKeywordEvent(e);

      return textMatch && fromOK && toOK && keywordOK;
    });
  }, [events, search, dateFrom, dateTo, keywordOnly]);

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
          meetingsOnly={keywordOnly}
          setMeetingsOnly={setKeywordOnly}
          exportCSV={() => exportToCSV(filtered)}
        />
        {renderContent()}
      </div>
    </>
  );
}
