export default function Tabs({ active, setActive }) {
  const tabs = ["All Events", "Meetings", "Calendar"];

  return (
    <div className="flex gap-3 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`pb-2 text-sm font-medium ${
            active === tab
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
