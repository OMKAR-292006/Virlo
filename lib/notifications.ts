import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';

export interface Notification {
  id: string;
  icon: string;
  title: string;
  desc: string;
  read: boolean;
  createdAt: any;
}

/** Listen to user's notifications in real-time */
export function subscribeToNotifications(
  uid: string,
  callback: (notifications: Notification[]) => void
) {
  const q = query(
    collection(db, 'notifications', uid, 'items'),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  return onSnapshot(q, snap => {
    const items: Notification[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
    callback(items);
  });
}

/** Mark a single notification as read */
export async function markNotificationRead(uid: string, notifId: string) {
  await updateDoc(doc(db, 'notifications', uid, 'items', notifId), { read: true });
}

/** Mark all notifications as read */
export async function markAllRead(uid: string) {
  const { getDocs } = await import('firebase/firestore');
  const q = query(collection(db, 'notifications', uid, 'items'), where('read', '==', false));
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map(d => updateDoc(d.ref, { read: true })));
}

/** Seed initial notifications for new users (call once after signup) */
export async function seedNotifications(uid: string) {
  const ref = collection(db, 'notifications', uid, 'items');
  const initial = [
    { icon: '🚀', title: 'Welcome to Brand Matic!', desc: 'Your workspace is ready. Start by generating a caption.', read: false },
    { icon: '🤖', title: 'AI plan ready', desc: 'Your first weekly content plan has been generated.', read: false },
    { icon: '📈', title: 'Get started', desc: 'Check out the Trend Engine to catch the next viral moment.', read: false },
  ];
  for (const n of initial) {
    await addDoc(ref, { ...n, createdAt: serverTimestamp() });
  }
}
