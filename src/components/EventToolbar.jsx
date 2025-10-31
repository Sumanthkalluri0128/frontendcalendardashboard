import { Download, Search, Filter } from "lucide-react";

export default function EventToolbar({
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  endBefore,
  setEndBefore, // ✅ new props
  meetingsOnly,
  setMeetingsOnly,
  exportCSV,
}) {
  return (
    <div className="toolbar">
      {/* Search */}
      <div className="toolbar-section">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Date Filters */}
      <div className="toolbar-section">
        <input
          type="date"
          className="date-input"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          className="date-input"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
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

      {/* Filters & Export */}
      <div className="toolbar-section">
        <button
          className={`btn btn-toggle ${meetingsOnly ? "active" : ""}`}
          onClick={() => setMeetingsOnly(!meetingsOnly)}
        >
          <Filter size={14} /> Expiry Events
        </button>

        <button className="btn btn-primary" onClick={exportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>
    </div>
  );
}
