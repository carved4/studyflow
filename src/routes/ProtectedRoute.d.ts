import React from 'react';
interface ProtectedRouteProps {
    component: React.ComponentType<React.PropsWithChildren<{}>>;
    children?: React.ReactNode;
}
export declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export {};
