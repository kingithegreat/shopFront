import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2 } from 'lucide-react';

interface ConfigContextType {
  isConfigured: boolean;
  businessProfile: any;
  homepageLayout: any;
  homepageContent: any;
  bookingRules: any;
  serviceArea: any;
  mediaAssets: any;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType>({
  isConfigured: false,
  businessProfile: null,
  homepageLayout: null,
  homepageContent: null,
  bookingRules: null,
  serviceArea: null,
  mediaAssets: null,
  loading: true,
});

export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    
    const docsToWatch = [
      'businessProfile',
      'homepageLayout',
      'homepageContent',
      'bookingRules',
      'serviceArea',
      'mediaAssets'
    ];

    let loadedCount = 0;

    docsToWatch.forEach((docId) => {
      const unsub = onSnapshot(doc(db, 'siteSettings', docId), (snap) => {
        setData((prev: any) => ({ ...prev, [docId]: snap.exists() ? snap.data() : null }));
        loadedCount++;
        if (loadedCount >= docsToWatch.length) {
          setLoading(false);
        }
      });
      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach(fn => fn());
    };
  }, []);

  const isConfigured = !!data.businessProfile?.setupComplete;

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#F5F5F7]"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;
  }

  return (
    <ConfigContext.Provider value={{ 
      isConfigured, 
      businessProfile: data.businessProfile,
      homepageLayout: data.homepageLayout,
      homepageContent: data.homepageContent,
      bookingRules: data.bookingRules,
      serviceArea: data.serviceArea,
      mediaAssets: data.mediaAssets,
      loading 
    }}>
      {children}
    </ConfigContext.Provider>
  );
}
