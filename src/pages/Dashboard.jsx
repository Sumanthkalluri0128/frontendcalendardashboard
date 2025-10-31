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

// ✅ unified key to group recurring & multi-day events
function getEventKey(e) {
  if (e.recurringEventId) return `r:${e.recurringEventId}`;
  if (e.iCalUID) return `i:${e.iCalUID}`;
  if (e.id) return `id:${e.id}`;

  const s = e.summary || "";
  const startRaw = e.start?.dateTime || e.start?.date || "";
  return `f:${s}|${startRaw}`;
}

// ✅ Merge multi-day events: earliest start + latest end
function uniqueByKey(events) {
  const groups = new Map();

  for (const ev of events) {
    const key = getEventKey(ev);
    const evStart = new Date(ev.start?.dateTime || ev.start?.date || 0);
    const evEnd = new Date(ev.end?.dateTime || ev.end?.date || 0);

    if (!groups.has(key)) {
      groups.set(key, {
        ...ev,
        _start: evStart,
        _end: evEnd,
      });
      continue;
    }

    const existing = groups.get(key);

    if (evStart < existing._start) existing._start = evStart;
    if (evEnd > existing._end) existing._end = evEnd;

    groups.set(key, existing);
  }

  return Array.from(groups.values()).map((ev) => ({
    ...ev,
    start: { dateTime: ev._start.toISOString() },
    end: { dateTime: ev._end.toISOString() },
  }));
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

  const isKeywordEvent = (e) => {
    const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();
    return KEYWORDS.some((k) => text.includes(k));
  };

  const filtered = useMemo(() => {
    if (!events) return [];

    const uniqueEvents = uniqueByKey(events);

    return uniqueEvents.filter((e) => {
      const text = search.toLowerCase();
      const textMatch =
        (e.summary || "").toLowerCase().includes(text) ||
        (e.organizer?.email || "").toLowerCase().includes(text);

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
