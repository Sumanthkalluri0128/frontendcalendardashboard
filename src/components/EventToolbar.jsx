import { Download, Search } from "lucide-react";

export default function EventToolbar({
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  endBefore,
  setEndBefore,
  meetingsOnly, // This is your 'keywordOnly' state from Dashboard
  setMeetingsOnly, // This is your 'setKeywordOnly' from Dashboard
  exportCSV,
  keywordSort, // <-- ADD THIS
  setKeywordSort, // <-- ADD THIS
}) {
  return (
    <div className="toolbar">
      <h3 className="filter-heading">Search & Filters</h3>

      <div className="toolbar-section">
        <label className="filter-label">Search</label>
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="toolbar-section">
        <label className="filter-label">Start From</label>
        <input
          type="date"
          className="date-input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <label className="filter-label">Start To</label>
        <input
          type="date"
          className="date-input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />

        <label className="filter-label">End Before</label>
        <input
          type="date"
          className="date-input"
          value={endBefore}
          onChange={(e) => setEndBefore(e.target.value)}
        />

        <span
          className="clear-btn"
          onClick={() => {
            setDateFrom("");
            setDateTo("");
            setEndBefore("");
          }}
        >
          Clear
        </span>
      </div>

      <div className="toolbar-section">
        <label className="filter-label">Expiry Events Only</label>
        <button
          className={`btn btn-toggle ${meetingsOnly ? "active" : ""}`}
          onClick={() => setMeetingsOnly(!meetingsOnly)}
        >
          Expiry Filter
        </button>

        {/* --- ADDED BUTTON FOR KEYWORD SORT --- */}
        <label className="filter-label">Sort by Expiry</label>
        <button
          className={`btn btn-toggle ${keywordSort ? "active" : ""}`}
          onClick={() => setKeywordSort(!keywordSort)}
        >
          Sort
        </button>

        <button className="btn btn-primary" onClick={exportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>
    </div>
  );
}
