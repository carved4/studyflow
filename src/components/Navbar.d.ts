import React from 'react';

interface NavbarProps {
  onLoginClick: () => void;
  className?: string;
}

declare const Navbar: React.FC<NavbarProps>;
export default Navbar;
