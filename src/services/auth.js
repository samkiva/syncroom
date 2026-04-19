import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const initAuth = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          resolve(userCredential.user);
        } catch (error) {
          reject(error);
        }
      }
    }, (error) => {
      unsubscribe();
      reject(error);
    });
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
