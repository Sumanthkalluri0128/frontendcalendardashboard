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

// ✅ Dedupe recurring / multi-day events
function getEventKey(e) {
  return (
    e.recurringEventId ||
    e.iCalUID ||
    e.id ||
    `${e.summary}|${e.start?.dateTime || e.start?.date}`
  );
}

function uniqueByKey(events) {
  const map = new Map();

  for (const e of events) {
    const key = getEventKey(e);
    const start = new Date(e.start.dateTime || e.start.date);
    const end = new Date(e.end.dateTime || e.end.date);

    if (!map.has(key)) {
      map.set(key, { ...e, __start: start, __end: end });
      continue;
    }

    const existing = map.get(key);
    if (start < existing.__start) existing.__start = start;
    if (end > existing.__end) existing.__end = end;
  }

  return Array.from(map.values()).map((e) => ({
    ...e,
    start: { dateTime: e.__start.toISOString() },
    end: { dateTime: e.__end.toISOString() },
  }));
}

export default function Dashboard() {
  const { events, fetchEvents, user, loading, error } = useAuth();

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [endBefore, setEndBefore] = useState("");
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

    const unique = uniqueByKey(events);

    return unique.filter((e) => {
      const s = search.toLowerCase();

      const start = new Date(e.start.dateTime || e.start.date);
      const end = new Date(e.end.dateTime || e.end.date);

      const matchesText =
        (e.summary || "").toLowerCase().includes(s) ||
        (e.organizer?.email || "").toLowerCase().includes(s);

      const afterStart = !dateFrom || start >= new Date(dateFrom);
      const beforeStart = !dateTo || start <= new Date(dateTo);

      // ✅ NEW LOGIC:
      // include if start OR end <= selected endBefore date
      const endCutoffOK =
        !endBefore ||
        start <= new Date(endBefore) ||
        end <= new Date(endBefore);

      const keywordOK = !keywordOnly || isKeywordEvent(e);

      return (
        matchesText && afterStart && beforeStart && endCutoffOK && keywordOK
      );
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
          endBefore={endBefore}
          setEndBefore={setEndBefore}
          meetingsOnly={keywordOnly}
          setMeetingsOnly={setKeywordOnly}
          exportCSV={() => exportToCSV(filtered)}
        />

        {endBefore && (
          <div className="info-tag">
            Showing events starting or ending on or before: <b>{endBefore}</b>
          </div>
        )}

        {loading && events.length === 0 && (
          <div className="dashboard-message">Loading events...</div>
        )}

        {error && (
          <div className="dashboard-message error">
            Error: {error}. Please login again.
          </div>
        )}

        {events.length > 0 && (
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
