import { Download, Users, Search } from "lucide-react";

export default function EventToolbar({
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  meetingsOnly,
  setMeetingsOnly,
  exportCSV,
}) {
  return (
    <div className="toolbar">
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
        <span
          className="clear-btn"
          onClick={() => {
            setDateFrom("");
            setDateTo("");
          }}
        >
          Clear
        </span>
      </div>

      <div className="toolbar-section">
        <button
          className={`btn btn-toggle ${meetingsOnly ? "active" : ""}`}
          onClick={() => setMeetingsOnly(!meetingsOnly)}
        >
          <Users size={14} /> Meetings
        </button>

        <button className="btn btn-primary" onClick={exportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>
    </div>
  );
}
