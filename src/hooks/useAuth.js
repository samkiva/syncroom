import { useState, useEffect } from 'react';
import { initAuth } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth().then((resolvedUser) => {
      setUser(resolvedUser);
      setLoading(false);
    }).catch((error) => {
      console.error("Auth initialization failed:", error);
      setLoading(false);
    });
  }, []);

  return { user, loading };
};
