import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import EventCard from "./EventCard";

const EventList = () => {
  const { events, fetchEvents } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        events.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </div>
  );
};

export default EventList;
