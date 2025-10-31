import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import EventToolbar from "../components/EventToolbar";
import EventTable from "../components/EventTable";
import { exportToCSV } from "../utils/exportCSV";
import "../styles/dashboard.css";

const KEYWORDS = [
  "expire","expired","expiry","renewal","renew",
  "password","expiring","cert","certificate","certs",
];

function getEventKey(e) {
  if (e.recurringEventId) return `r:${e.recurringEventId}`;
  if (e.iCalUID) return `i:${e.iCalUID}`;
  if (e.id) return `id:${e.id}`;
  const s = e.summary || "";
  const startRaw = e.start?.dateTime || e.start?.date || "";
  return `f:${s}|${startRaw}`;
}

// ✅ merge events correctly & preserve merged dates for filter
function uniqueByKey(events) {
  const groups = new Map();

  for (const ev of events) {
    const key = getEventKey(ev);
    const evStart = new Date(ev.start?.dateTime || ev.start?.date);
    const evEnd = new Date(ev.end?.dateTime || ev.end?.date);

    if (!groups.has(key)) {
      groups.set(key, {
        ...ev,
        _start: evStart,
        _end: evEnd,
      });
      continue;
    }

    const ex = groups.get(key);
    if (evStart < ex._start) ex._start = evStart;
    if (evEnd > ex._end) ex._end = evEnd;
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
  const [endBefore, setEndBefore] = useState("");
  const [keywordOnly, setKeywordOnly] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (user || localStorage.getItem("token")) fetchEvents();
  }, [user, fetchEvents]);

  const isKeywordEvent = (e) => {
    const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();
    return KEYWORDS.some((k) => text.includes(k));
  };

  // ✅ filtering using merged end date logic
  const filtered = useMemo(() => {
    if (!events) return [];

    const uniqueEvents = uniqueByKey(events);

    return uniqueEvents.filter((e) => {
      const s = search.toLowerCase();

      const start = new Date(e.start.dateTime);
      const end = new Date(e.end.dateTime);

      const matchText =
        (e.summary || "").toLowerCase().includes(s) ||
        (e.organizer?.email || "").toLowerCase().includes(s);

      const afterFrom = !dateFrom || start >= new Date(dateFrom);
      const beforeTo = !dateTo || start <= new Date(dateTo);

      // ✅ fix: now filtering based on merged `_end`
      const beforeEndCutoff = !endBefore || end <= new Date(endBefore);

      const keywordPass = !keywordOnly || isKeywordEvent(e);

      return matchText && afterFrom && beforeTo && beforeEndCutoff && keywordPass;
    });
  }, [events, search, dateFrom, dateTo, endBefore, keywordOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <EventToolbar
          search={search} setSearch={setSearch}
          dateFrom={dateFrom} setDateFrom={setDateFrom}
          dateTo={dateTo} setDateTo={setDateTo}
          endBefore={endBefore} setEndBefore={setEndBefore}
          meetingsOnly={keywordOnly} setMeetingsOnly={setKeywordOnly}
          exportCSV={() => exportToCSV(filtered)}
        />

        {loading && events.length === 0 && (
          <div className="dashboard-message">Loading events...</div>
        )}

        {error && <div className="dashboard-message error">{error}</div>}

        {!loading && events.length === 0 && (
          <div className="dashboard-message">No events found.</div>
        )}

        {!loading && events.length > 0 && (
          <>
            <EventTable events={paginated} />
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>Page {page}/{totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
