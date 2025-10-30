export function exportToCSV(events) {
  const rows = events.map((e) => ({
    summary: e.summary,
    organizer: e.organizer?.email,
    start: e.start.dateTime || e.start.date,
    end: e.end.dateTime || e.end.date,
    attendees: e.attendees?.map((a) => a.email).join("; ") || "",
    link: e.htmlLink,
  }));

  const csv = [
    ["Summary", "Organizer", "Start", "End", "Attendees", "Link"],
    ...rows.map((r) =>
      Object.values(r)
        .map((v) => `"${v}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "events.csv";
  a.click();
}
