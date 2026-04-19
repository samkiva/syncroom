import React, { useState } from 'react';
import { createEvent } from '../services/events';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState(25);
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setLoading(true);
    try {
      const eventId = await createEvent(title, category, Number(duration), user.uid);
      const url = `${window.location.origin}/room/${eventId}`;
      setInviteUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setInviteUrl('');
    setTitle('');
    setCategory('');
    setDuration(25);
    setCopied(false);
  };

  if (!user) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
      Authenticating securely...
    </div>
  );

  return (
    <div className="home-container">
      <h1 className="home-title">SyncRoom</h1>
      <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '-28px', marginBottom: '40px', fontSize: '0.95rem' }}>
        Private, focused work sessions. Invite-only.
      </p>

      {!inviteUrl ? (
        <section className="card">
          <h2>Create a Private Room</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label>Session Title</label>
              <input
                type="text"
                id="session-title"
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
                id="session-category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Coding, Reading, Design..."
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                id="session-duration"
                className="form-control"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 25"
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              id="create-room-btn"
              className="btn-primary"
              disabled={!title.trim() || !category.trim() || loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? 'Creating Room...' : 'Create Room'}
            </button>
          </form>
        </section>
      ) : (
        <section className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: '#EEF2FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '1.5rem'
            }}>
              🔗
            </div>
            <h2 style={{ marginBottom: '6px', borderBottom: 'none', paddingBottom: 0 }}>Room Created!</h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
              Share this link to invite people:
            </p>
          </div>

          <div style={{
            background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px',
            padding: '14px 16px', marginBottom: '16px', wordBreak: 'break-all',
            fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace',
            lineHeight: '1.6'
          }}>
            {inviteUrl}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              id="copy-invite-btn"
              className="btn-primary"
              onClick={handleCopy}
              style={{ flex: 1 }}
            >
              {copied ? '✓ Copied!' : 'Copy Invite Link'}
            </button>
            <a
              href={inviteUrl}
              id="enter-room-btn"
              className="btn-secondary"
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '12px 24px', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Enter Room →
            </a>
          </div>

          <button
            id="create-another-btn"
            className="btn-outline"
            onClick={handleCreateAnother}
            style={{ width: '100%' }}
          >
            Create Another Room
          </button>
        </section>
      )}
    </div>
  );
};

export default Home;
