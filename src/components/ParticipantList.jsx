import React from 'react';

const ParticipantList = ({ participants }) => {
  return (
    <div className="participant-list">
      <h4>Participants</h4>
      <ul>
        {participants && participants.length > 0 ? (
          participants.map((p, index) => <li key={index}>{p.email || p.name || 'Anonymous'}</li>)
        ) : (
          <li>No participants yet.</li>
        )}
      </ul>
    </div>
  );
};

export default ParticipantList;
