import { db, auth } from '@/config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, setDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export { db, auth, collection, addDoc, getDocs, query, where, orderBy, setDoc, doc, updateDoc, arrayUnion }; 