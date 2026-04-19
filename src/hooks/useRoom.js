import { useState, useEffect } from 'react';
import { getEventById } from '../services/events';
import { subscribeToMessages, sendMessage } from '../services/chat';

export const useRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      if (roomId) {
        const roomData = await getEventById(roomId);
        setRoom(roomData);
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (roomId) {
      unsubscribe = subscribeToMessages(roomId, (newMessages) => {
        setMessages(newMessages);
      });
    }
    return unsubscribe;
  }, [roomId]);

  return { room, messages, loading, sendMessage };
};
