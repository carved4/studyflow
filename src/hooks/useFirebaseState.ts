import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

export function useFirebaseState<T>(
  collectionName: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => Promise<void>, boolean, Error | null] {
  const [state, setState] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const setupSubscription = async () => {
      if (!auth.currentUser) {
        setError(new Error('User must be authenticated'));
        setIsLoading(false);
        return;
      }

      try {
        // Create a reference to the user's data document
        const dataDocRef = doc(db, `users/${auth.currentUser.uid}/${collectionName}/userData`);
        
        // Check if document exists and initialize if needed
        const docSnap = await getDoc(dataDocRef);
        if (!docSnap.exists()) {
          await setDoc(dataDocRef, {
            value: initialValue,
            createdAt: serverTimestamp()
          });
        }

        // Set up real-time listener
        if (isMounted) {
          unsubscribe = onSnapshot(
            dataDocRef,
            (snapshot) => {
              if (snapshot.exists()) {
                setState(snapshot.data().value);
              }
              setIsLoading(false);
            },
            (err) => {
              console.error(`Error fetching ${collectionName}:`, err);
              setError(err instanceof Error ? err : new Error(String(err)));
              setIsLoading(false);
            }
          );
        }
      } catch (err) {
        console.error('Error setting up subscription:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth.currentUser?.uid, collectionName, initialValue, db]);

  const updateState = async (value: T | ((prev: T) => T)) => {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    try {
      const newState = value instanceof Function ? value(state) : value;
      const dataDocRef = doc(db, `users/${auth.currentUser.uid}/${collectionName}/userData`);
      
      await setDoc(dataDocRef, {
        value: newState,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setState(newState);
      setError(null);
    } catch (err) {
      console.error(`Error updating ${collectionName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return [state, updateState, isLoading, error];
}
