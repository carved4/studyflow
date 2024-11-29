import { User } from 'firebase/auth';
declare const app: import("@firebase/app").FirebaseApp;
export declare const auth: import("@firebase/auth").Auth;
export declare const db: import("@firebase/firestore").Firestore;
export declare const signUp: (email: string, password: string, displayName?: string) => Promise<User>;
export declare const signIn: (email: string, password: string) => Promise<User>;
export declare const signOut: () => Promise<void>;
export declare const getUserDetails: (uid: string) => Promise<import("@firebase/firestore").DocumentData>;
export default app;
