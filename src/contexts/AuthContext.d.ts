import { PropsWithChildren } from 'react';
import { User } from 'firebase/auth';
interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    userDetails: Record<string, any> | null;
}
export declare const AuthProvider: ({ children }: PropsWithChildren<{}>) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
