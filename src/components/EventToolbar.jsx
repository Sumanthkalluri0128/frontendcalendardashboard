import React from "react";
import "../styles/dashboard.css";

export default function EventToolbar({
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  endBefore,
  setEndBefore,
  meetingsOnly,
  setMeetingsOnly,
  exportCSV,
}) {
  return (
    <div className="toolbar-container">
      <h3 className="filter-heading">🔎 Search & Filters</h3>

      <div className="toolbar-grid">
        {/* Search */}
        <div className="toolbar-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            placeholder="Search event or organizer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* From Date */}
        <div className="toolbar-group">
          <label className="filter-label">Start From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className="toolbar-group">
          <label className="filter-label">Start To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* End Before */}
        <div className="toolbar-group">
          <label className="filter-label">End Before</label>
          <input
            type="date"
            value={endBefore}
            onChange={(e) => setEndBefore(e.target.value)}
          />
        </div>

        {/* Keyword/Expiry filter toggle */}
        <div className="toolbar-group checkbox-group">
          <label className="filter-label">Expiry Events Only</label>
          <input
            type="checkbox"
            checked={meetingsOnly}
            onChange={(e) => setMeetingsOnly(e.target.checked)}
          />
        </div>

        {/* Export */}
        <div className="toolbar-group">
          <label className="filter-label">Export</label>
          <button onClick={exportCSV}>Download CSV</button>
        </div>
      </div>
    </div>
  );
}
