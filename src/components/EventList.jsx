import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/events';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="event-list">
      {events.length > 0 ? (
        events.map(event => <EventCard key={event.id} event={event} />)
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
};

export default EventList;
