import React from 'react';
interface AuthModalProps {
    open: boolean;
    onClose: () => void;
}
declare const AuthModal: React.FC<AuthModalProps>;
export default AuthModal;
