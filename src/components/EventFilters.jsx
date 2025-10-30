export default function EventFilters({
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  return (
    <div className="bg-white p-4 shadow rounded-md flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full md:w-1/3"
      />

      <div className="flex gap-2">
        <label className="text-sm text-gray-600 flex flex-col">
          From
          <input
            type="date"
            className="border p-2 rounded"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>

        <label className="text-sm text-gray-600 flex flex-col">
          To
          <input
            type="date"
            className="border p-2 rounded"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
