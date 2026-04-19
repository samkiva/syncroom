import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { joinEvent, leaveEvent, subscribeToParticipants, endEventEarly } from '../services/events';
import { sendMessage, subscribeToMessages } from '../services/chat';
import { useAuth } from '../hooks/useAuth';
import { formatDuration } from '../utils/time';

const Room = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [eventData, setEventData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  
  // Profile intercepters
  const [hasJoined, setHasJoined] = useState(false);
  const [profileName, setProfileName] = useState(localStorage.getItem('syncroom_name') || '');
  const [profileFocus, setProfileFocus] = useState(localStorage.getItem('syncroom_focus') || '');
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef(null);
  const originalTitle = useRef(document.title);
  const lastMessageId = useRef(null);

  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMsg = messages[messages.length - 1];
    
    // Only notify if it's a NEW message from SOMEONE ELSE while the tab is HIDDEN
    if (document.hidden && lastMsg.id !== lastMessageId.current && user && lastMsg.userId !== user.uid) {
      document.title = "💬 New Message - SyncRoom";
      
      const handleVis = () => {
        if (!document.hidden) {
          document.title = originalTitle.current;
          document.removeEventListener('visibilitychange', handleVis);
        }
      };
      document.addEventListener('visibilitychange', handleVis);
    }
    
    // Update last seen ID
    lastMessageId.current = lastMsg.id;
    
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, user?.uid]);

  // Real-time event data subscription — covers End Early updates
  useEffect(() => {
    if (!user || !eventId) return;
    const eventRef = doc(db, 'events', eventId);
    const unsubEvent = onSnapshot(eventRef, (docSnap) => {
      if (!docSnap.exists()) {
        setNotFound(true);
        return;
      }
      const data = docSnap.data();
      setEventData(data);
      // Immediately derive ended state from the incoming snapshot
      const expireTime =
        typeof data.expiresAt?.toDate === 'function'
          ? data.expiresAt.toDate().getTime()
          : new Date(data.expiresAt).getTime();
      if (expireTime <= Date.now()) {
        setIsEnded(true);
        setTimeLeft(0);
      } else {
        setIsEnded(false);
      }
    }, () => {
      // On permission error or network failure, treat as not found
      setNotFound(true);
    });
    return () => unsubEvent();
  }, [user, eventId]);

  // Join execution and subscriptions
  useEffect(() => {
    if (!user || !eventId || !hasJoined) return;

    let unsubParticipants = () => {};
    let unsubMessages = () => {};
    let joined = false;

    const setupRoom = async () => {
      try {
        await joinEvent(eventId, user, profileName, profileFocus);
        joined = true;
        unsubParticipants = subscribeToParticipants(eventId, setParticipants);
        unsubMessages = subscribeToMessages(eventId, setMessages);
      } catch (error) {
        console.error("Failed to setup room:", error);
      }
    };

    setupRoom();

    return () => {
      if (joined) {
        leaveEvent(eventId, user.uid).catch(err => console.error(err));
      }
      unsubParticipants();
      unsubMessages();
    };
  }, [user, eventId, hasJoined, profileName, profileFocus]);

  // Countdown timer — only runs while the session is still active
  useEffect(() => {
    if (!eventData?.expiresAt || isEnded) return;

    const expireTime =
      typeof eventData.expiresAt.toDate === 'function'
        ? eventData.expiresAt.toDate().getTime()
        : new Date(eventData.expiresAt).getTime();

    const updateTime = () => {
      const remainingMs = Math.max(0, expireTime - Date.now());
      if (remainingMs === 0) {
        setIsEnded(true);
        setTimeLeft(0);
      } else {
        setTimeLeft(remainingMs);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [eventData, isEnded]);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    localStorage.setItem('syncroom_name', profileName.trim());
    localStorage.setItem('syncroom_focus', profileFocus.trim());
    setHasJoined(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    try {
      await sendMessage(eventId, text, user.uid);
      setText('');
    } catch (e) {
      console.error("Error sending message", e);
    }
  };

  const formatTime = (ms) => {
    if (ms === null) return '--:--';
    return formatDuration(ms);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndEarly = async () => {
    if (window.confirm("End this session for everyone?")) {
      try {
        await endEventEarly(eventId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatMsgTime = (timestamp) => {
    if (!timestamp) return '';
    const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Initializing secure connection...</div>;

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '12px', color: '#111827' }}>Room Not Found</h2>
        <p style={{ color: '#6B7280', lineHeight: '1.6' }}>This room does not exist or has ended. Ask your host for a new invite link.</p>
      </div>
    </div>
  );

  if (!eventData) return <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading room data...</div>;

  // Render Join Interceptor
  if (!hasJoined) {
    return (
      <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 24px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Join Session</h2>
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px' }}>
            {eventData.title} • {eventData.category}
          </p>
          <form onSubmit={handleJoinSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                className="form-control"
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                placeholder="How should others call you?"
                required 
              />
            </div>
            <div className="form-group">
              <label>Current Focus (Optional)</label>
              <input 
                type="text" 
                className="form-control"
                value={profileFocus} 
                onChange={(e) => setProfileFocus(e.target.value)} 
                placeholder="What are you working on?"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={!profileName.trim()}>
              Enter Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isDangerTime = timeLeft !== null && timeLeft <= 300000; // Under 5 minutes

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <header className="room-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{eventData.title || 'Untitled Session'}</h2>
          <span style={{ fontSize: '0.85rem', color: '#4F46E5', fontWeight: '500', background: '#EEF2FF', padding: '4px 8px', borderRadius: '4px' }}>
            {eventData.category}
          </span>
        </div>
        <div className={`room-timer ${isDangerTime && !isEnded ? 'danger' : ''}`}>
          {isEnded ? <span style={{ color: '#EF4444' }}>Ended</span> : formatTime(timeLeft)}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {user.uid === eventData.hostId && !isEnded && (
            <button className="btn-outline" style={{ color: '#EF4444', borderColor: '#FCA5A5' }} onClick={handleEndEarly}>
              End Early
            </button>
          )}
          <button className="btn-outline" onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Share Link'}
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>Leave Session</button>
        </div>
      </header>

      <div className="room-layout">
        <div className="chat-column">
          <div className="chat-container">
            <div className="chat-history">
              <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '24px', fontStyle: 'italic' }}>
                Start a productive conversation.
              </div>
              
              {messages.map((msg, i) => {
                const isMine = msg.userId === user.uid;
                // Try to find the participant name. If not found, fallback to ID.
                const participantInfo = participants.find(p => p.id === msg.userId);
                const senderName = isMine ? 'You' : (participantInfo ? participantInfo.name : msg.userId.substring(0, 8));

                return (
                  <div key={msg.id || i} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div className={`chat-bubble ${isMine ? 'chat-mine' : 'chat-other'}`}>
                      {!isMine && <div className="chat-sender">{senderName}</div>}
                      <div style={{ lineHeight: '1.5' }}>{msg.text}</div>
                      <span className="chat-timestamp">{msg.createdAt ? formatMsgTime(msg.createdAt) : formatMsgTime(new Date())}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={handleSend}>
              <input 
                type="text" 
                className="form-control"
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Type your strategy..." 
                disabled={isEnded}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn-send"
                disabled={isEnded || !text.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="participant-column">
          <div className="participant-list">
            <h3>Active Session ({participants.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {participants.map(p => (
                <div key={p.id} className="participant-item" style={{ alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{p.id === user.uid ? `${p.name} (You)` : p.name}</div>
                    {p.focus && <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>Focusing on: {p.focus}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
