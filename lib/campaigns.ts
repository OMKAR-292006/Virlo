import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Campaign {
  id?: string;
  name: string;
  platform: string;
  type: 'caption' | 'festival' | 'plan';
  status: 'Active' | 'Draft' | 'Completed';
  createdAt?: any;
}

/** Save a campaign entry when AI generates content */
export async function saveCampaign(uid: string, data: Omit<Campaign, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'campaigns', uid, 'items'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Load the user's most recent campaigns */
export async function getCampaigns(uid: string, max = 10): Promise<Campaign[]> {
  const q = query(
    collection(db, 'campaigns', uid, 'items'),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
}
