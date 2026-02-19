// lib/auth.ts - rozszerzona wersja
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Poprzednie funkcje...
export const registerWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  
  // Stwórz profil użytkownika w Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    name,
    email,
    createdAt: new Date(),
    bio: '',
    company: '',
    phone: ''
  });
  
  return userCredential.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  
  // Sprawdź czy profil już istnieje
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  if (!userDoc.exists()) {
    // Stwórz profil dla nowego użytkownika Google
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: userCredential.user.displayName || '',
      email: userCredential.user.email,
      createdAt: new Date(),
      bio: '',
      company: '',
      phone: ''
    });
  }
  
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

// NOWE FUNKCJE
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const updateUserPassword = async (newPassword: string) => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
};

export const updateUserProfile = async (data: {
  name?: string;
  bio?: string;
  company?: string;
  phone?: string;
}) => {
  if (!auth.currentUser) throw new Error('Nie jesteś zalogowany');
  
  // Aktualizuj Firebase Auth
  if (data.name) {
    await updateProfile(auth.currentUser, { displayName: data.name });
  }
  
  // Aktualizuj Firestore
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    ...data,
    updatedAt: new Date()
  });
};

export const getUserProfile = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
};