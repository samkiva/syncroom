import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  serverTimestamp, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  onSnapshot 
} from "firebase/firestore";
import { db } from "./firebase";

export const createEvent = async (title, category, duration, userId) => {
  const eventsCollection = collection(db, "events");
  const now = new Date();
  
  // convert duration (minutes) to milliseconds
  const durationMs = duration * 60 * 1000;
  const expiresAt = new Date(now.getTime() + durationMs);

  const docRef = await addDoc(eventsCollection, {
    title,
    category,
    duration,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
    hostId: userId
  });
  
  return docRef.id;
};

export const joinEvent = async (eventId, user, displayName, focus) => {
  const participantRef = doc(db, "events", eventId, "participants", user.uid);
  await setDoc(participantRef, {
    name: displayName || user.uid.substring(0, 8),
    focus: focus || '',
    joinedAt: serverTimestamp()
  });
};

export const leaveEvent = async (eventId, userId) => {
  const participantRef = doc(db, "events", eventId, "participants", userId);
  await deleteDoc(participantRef);
};

export const subscribeToParticipants = (eventId, callback) => {
  const participantsCollection = collection(db, "events", eventId, "participants");
  
  return onSnapshot(participantsCollection, (snapshot) => {
    const participants = snapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    }));
    callback(participants);
  });
};

export const endEventEarly = async (eventId) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    expiresAt: Timestamp.fromDate(new Date())
  });
};
