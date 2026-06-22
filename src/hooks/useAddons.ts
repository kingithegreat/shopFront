import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  sortOrder: number;
}

export function useAddons() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddons() {
      try {
        const q = query(
          collection(db, 'addons'),
          where('active', '==', true),
          orderBy('sortOrder', 'asc')
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Addon[];
        
        setAddons(fetched);
      } catch (err) {
        console.error('Error fetching addons:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAddons();
  }, []);

  return { addons, loading };
}
