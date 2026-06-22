import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Dev bypass: just set a mock owner user if auth fails
        setUserData({
          uid: 'mock-dev',
          email: 'dev@example.com',
          role: 'owner',
          createdAt: Date.now()
        } as User);
        setLoading(false);
        return;
      }
      
      setCurrentUser(user);
      
      // Fetch or create user record in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data() as User;
        // Override role to 'owner' for development bypass
        setUserData({ ...data, role: 'owner' });
      } else {
        // New user
        const newUser: User = {
          uid: user.uid,
          email: user.email || 'dev@example.com',
          role: 'owner', // Force owner for development
          createdAt: Date.now(),
        };
        await setDoc(userRef, newUser);
        setUserData(newUser);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
