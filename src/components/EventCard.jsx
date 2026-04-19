import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <h3>{event.title || 'Untitled Event'}</h3>
      <p>{event.description || 'No description provided.'}</p>
      <Link to={`/room/${event.id}`}>Join Room</Link>
    </div>
  );
};

export default EventCard;
