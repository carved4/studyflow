import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Log all environment variables
console.log('Environment Variables:', {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID
});

// Debug Firebase Config
console.log('Firebase Config (without sensitive data):', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sign Up Function
export const signUp = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> => {
  try {
    console.log('Starting signup process for email:', email);
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created successfully:', user.uid);

    // Update profile with display name if provided
    if (displayName) {
      console.log('Updating display name...');
      await updateProfile(user, { displayName });
      console.log('Display name updated successfully');
    }

    // Create user document in Firestore
    console.log('Creating user document in Firestore...');
    await createUserDocument(user, { displayName });
    console.log('User document created successfully');

    return user;
  } catch (error: any) {
    console.error('Detailed signup error:', {
      code: error.code,
      message: error.message,
      fullError: error
    });
    
    // More specific error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please try logging in instead.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is not valid.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/password accounts are not enabled. Please contact support.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('The password is too weak. Please choose a stronger password.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }
};

// Sign In Function
export const signIn = async (
  email: string, 
  password: string
): Promise<User> => {
  try {
    console.log('Starting login process for email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('Detailed login error:', {
      code: error.code,
      message: error.message,
      fullError: error
    });
    
    // More specific error messages
    if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is not valid.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('User not found. Please sign up first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Invalid password. Please try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
};

// Sign Out Function
export const signOut = async () => {
  try {
    console.log('Starting logout process...');
    await firebaseSignOut(auth);
    console.log('Logout successful');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Detailed signout error:', {
        message: error.message,
        name: error.name
      });
      
      // More specific error messages
      if (error.message.includes('no-current-user')) {
        throw new Error('No user is currently signed in.');
      } else {
        throw new Error(`Logout failed: ${error.message}`);
      }
    } else {
      console.error('Unknown error during signout:', error);
      throw new Error('An unknown error occurred during logout.');
    }
  }
};

// Create User Document in Firestore
const createUserDocument = async (
  user: User, 
  additionalData?: { displayName?: string }
) => {
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: additionalData?.displayName || user.displayName,
      createdAt: serverTimestamp()
    });
  } catch (error: unknown) {
    // Type guard to check if error is an Error object
    const processError = (err: unknown): Error => {
      if (err instanceof Error) return err;
      if (typeof err === 'string') return new Error(err);
      return new Error('An unknown error occurred');
    };

    const processedError = processError(error);
    
    console.error('Detailed error creating user document:', {
      message: processedError.message,
      name: processedError.name,
      stack: processedError.stack
    });
    
    // More specific error messages
    if (processedError.message.includes('permission-denied')) {
      throw new Error('Permission denied. Please contact support.');
    } else {
      throw new Error(`Failed to create user profile: ${processedError.message}`);
    }
  }
};

// Get User Details
export const getUserDetails = async (uid: string) => {
  try {
    console.log('Fetching user details for uid:', uid);
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log('User details fetched successfully:', docSnap.data());
      return docSnap.data();
    } else {
      throw new Error('User document not found');
    }
  } catch (error: unknown) {
    // Type guard to check if error is an Error object
    const processError = (err: unknown): Error => {
      if (err instanceof Error) return err;
      if (typeof err === 'string') return new Error(err);
      return new Error('An unknown error occurred');
    };

    const processedError = processError(error);
    
    console.error('Detailed error fetching user details:', {
      message: processedError.message,
      name: processedError.name,
      stack: processedError.stack
    });
    
    // More specific error messages
    if (processedError.message.includes('permission-denied')) {
      throw new Error('Permission denied. Please contact support.');
    } else {
      throw new Error(`Failed to fetch user details: ${processedError.message}`);
    }
  }
};

export default app;
