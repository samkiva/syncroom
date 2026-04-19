import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const sendMessage = async (eventId, text, userId) => {
  const messagesCollection = collection(db, "events", eventId, "messages");
  
  const docRef = await addDoc(messagesCollection, {
    text,
    userId,
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
};

export const subscribeToMessages = (eventId, callback) => {
  const messagesCollection = collection(db, "events", eventId, "messages");
  const q = query(messagesCollection, orderBy("createdAt", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};
