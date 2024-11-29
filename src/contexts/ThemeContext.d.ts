import React from 'react';
type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
