import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  industry: string;
  website?: string;
  location?: string;
  targetAudience?: string;
  ageGroup?: string;
  gender?: string;
  interests?: string;
  goals?: string[];
  brandTone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'profiles', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, 'profiles', uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
