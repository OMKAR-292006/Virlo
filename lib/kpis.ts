import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface KpiData {
  engagement: string;
  engagementChange: string;
  ctr: string;
  ctrChange: string;
  roas: string;
  roasChange: string;
  followers: string;
  followersChange: string;
  updatedAt?: string;
}

const DEFAULTS: KpiData = {
  engagement: '—',
  engagementChange: '—',
  ctr: '—',
  ctrChange: '—',
  roas: '—',
  roasChange: '—',
  followers: '—',
  followersChange: '—',
};

export async function getKpis(uid: string): Promise<KpiData> {
  const snap = await getDoc(doc(db, 'kpis', uid));
  return snap.exists() ? (snap.data() as KpiData) : DEFAULTS;
}

export async function saveKpis(uid: string, data: Partial<KpiData>): Promise<void> {
  await setDoc(doc(db, 'kpis', uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
