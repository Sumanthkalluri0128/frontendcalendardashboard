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

const containsKeyword = (e) => {
  const text = `${e.summary || ""} ${e.description || ""}`.toLowerCase();
  return KEYWORDS.some((k) => text.includes(k));
};

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
  const [keywordSort, setKeyWordSort] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    // You had a bug here, calling fetchEvents as a dependency
    // which can cause infinite loops.
    if (user) {
      fetchEvents();
    }
    // Add 'fetchEvents' to the dependency array if it's guaranteed stable
    // (e.g., wrapped in useCallback in your context).
    // If not, just call it based on 'user'.
  }, [user, fetchEvents]); // Corrected dependencies

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

      const endCutoffOK =
        !endBefore ||
        start <= new Date(endBefore) ||
        end <= new Date(endBefore);

      const keywordOK = !keywordOnly || isKeywordEvent(e);

      // --- BUG 2 FIX: Removed 'meetingOK' ---
      return matchesText && afterStart && beforeStart && endCutoffOK && keywordOK;
    });
    // --- BUG 2 FIX: Add 'keywordOnly' to dependency array ---
  }, [events, search, dateFrom, dateTo, endBefore, keywordOnly]);

  // --- BUG 1 FIX: Moved this logic *before* totalPages and paginated ---
  let sorted = [...filtered];

  if (keywordSort) {
    sorted.sort((a, b) => {
      const aKey = containsKeyword(a) ? 1 : 0;
      const bKey = containsKeyword(b) ? 1 : 0;
      return bKey - aKey; // Sorts keyword events to the top
    });
  }

  // --- Now these lines will work ---
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

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
          meetingsOnly={keywordOnly} // This prop name is confusing,
          setMeetingsOnly={setKeywordOnly} // You should rename it in EventToolbar
          keywordSort={keywordSort}
          setKeywordSort={setKeyWordSort}
          exportCSV={() => exportToCSV(filtered)} // Exporting 'filtered' is fine
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

        {/* --- FIX: Check for 'sorted.length' instead of 'events.length' --- */}
        {/* This prevents showing "No events found" while loading */}
        {!loading && !error && sorted.length === 0 && (
          <div className="dashboard-message">No events found.</div>
        )}
        
        {/* Only show table if we have events to show */}
        {sorted.length > 0 && (
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
