import { useEffect } from 'react';

export const useIOSKeyboard = () => {
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    const handleFocus = () => {
      // Add padding to prevent input from being hidden by keyboard
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }, 50);
    };

    const handleBlur = () => {
      // Reset the viewport when keyboard is dismissed
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    };

    // Get all input elements
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);
};
