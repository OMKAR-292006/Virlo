import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface DemographicEntry {
  name: string;
  value: number;
}

export interface AnalyticsData {
  demographics: DemographicEntry[];
  updatedAt?: string;
}

const DEFAULT_DEMOGRAPHICS: DemographicEntry[] = [
  { name: '18-24', value: 0 },
  { name: '25-34', value: 0 },
  { name: '35-44', value: 0 },
  { name: '45+',   value: 0 },
];

export async function getAnalytics(uid: string): Promise<AnalyticsData> {
  const snap = await getDoc(doc(db, 'analytics', uid));
  return snap.exists()
    ? (snap.data() as AnalyticsData)
    : { demographics: DEFAULT_DEMOGRAPHICS };
}

export async function saveAnalytics(uid: string, data: Partial<AnalyticsData>): Promise<void> {
  await setDoc(doc(db, 'analytics', uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
