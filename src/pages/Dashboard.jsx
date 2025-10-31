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

// ✅ merge multi-day & recurring events properly
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

    const e = groups.get(key);
    if (evStart < e._start) e._start = evStart;
    if (evEnd > e._end) e._end = evEnd;
  }

  return Array.from(groups.values()).map((e) => ({
    ...e,
    start: { dateTime: e._start.toISOString() },
    end: { dateTime: e._end.toISOString() },
  }));
}

export default function Dashboard() {
  const { events, fetchEvents, user, loading, error } = useAuth();

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [endBefore, setEndBefore] = useState(""); // ✅ NEW FILTER
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

  // ✅ final filtering logic
  const filtered = useMemo(() => {
    if (!events) return [];

    const uniqueEvents = uniqueByKey(events);

    return uniqueEvents.filter((e) => {
      const s = search.toLowerCase();
      const textMatch =
        (e.summary || "").toLowerCase().includes(s) ||
        (e.organizer?.email || "").toLowerCase().includes(s);

      const start = new Date(e.start.dateTime || e.start.date || 0);
      const end = new Date(e.end.dateTime || e.end.date || 0);

      const fromOK = !dateFrom || start >= new Date(dateFrom);
      const toOK = !dateTo || start <= new Date(dateTo);
      const endBeforeOK = !endBefore || end <= new Date(endBefore);

      const keywordOK = !keywordOnly || isKeywordEvent(e);

      return textMatch && fromOK && toOK && endBeforeOK && keywordOK;
    });
  }, [events, search, dateFrom, dateTo, endBefore, keywordOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
          endBefore={endBefore} // ✅ NEW
          setEndBefore={setEndBefore} // ✅ NEW
          meetingsOnly={keywordOnly}
          setMeetingsOnly={setKeywordOnly}
          exportCSV={() => exportToCSV(filtered)}
        />

        {loading && events.length === 0 && (
          <div className="dashboard-message">Loading events...</div>
        )}

        {error && (
          <div className="dashboard-message error">
            Error: {error}. Please try logging in again.
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="dashboard-message">
            No events found in your calendar.
          </div>
        )}

        {!loading && events.length > 0 && (
          <>
            <EventTable events={paginated} />
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
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
        )}
      </div>
    </>
  );
}
