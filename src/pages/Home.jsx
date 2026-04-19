import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, getActiveEvents } from '../services/events';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeEvents, setActiveEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getActiveEvents();
        setActiveEvents(events);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setLoading(true);
    try {
      const eventId = await createEvent(title, category, Number(duration), user.uid);
      navigate(`/room/${eventId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Authenticating securely...</div>;

  return (
    <div className="home-container">
      <h1 className="home-title">SyncRoom</h1>

      <section className="card">
        <h2>Create a Room</h2>
        <form onSubmit={handleCreateRoom}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              className="form-control"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Deep Work Session"
              required 
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input 
              type="text" 
              className="form-control"
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="e.g. Coding, Reading, Analytics..."
              required
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input 
              type="number" 
              className="form-control"
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
              placeholder="e.g. 45"
              min="1"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!title.trim() || loading} style={{ marginTop: '12px' }}>
            {loading ? 'Setting up Room...' : 'Create Room'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="active-events-title">Active Events</h2>
        {activeEvents.length === 0 ? (
          <p style={{ color: '#6B7280', fontStyle: 'italic', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
            No active events right now. Create one above!
          </p>
        ) : (
          <div>
            {activeEvents.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{event.category ? `${event.category} • ` : ''}{event.duration} mins allocation</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate(`/room/${event.id}`)}>Join Session</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
