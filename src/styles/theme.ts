import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Theme } from '@mui/material';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 500,
      fontSize: '0.875rem'
    },
  },
  shape: {
    borderRadius: 16,
  },
};

const lightTheme: Theme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1d9bf0',
      light: '#1d9bf0',
      dark: '#1a8cd8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#536471',
      light: '#8b98a5',
      dark: '#536471',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f1419',
      secondary: '#536471',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    action: {
      hover: 'rgba(15, 20, 25, 0.1)',
      selected: 'rgba(15, 20, 25, 0.2)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
          '& .MuiToolbar-root': {
            minHeight: '64px',
            padding: '0 24px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: 'rgba(15, 20, 25, 0.1)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1a8cd8',
          },
        },
      },
    },
  },
});

const darkTheme: Theme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#1d9bf0',
      light: '#1d9bf0',
      dark: '#1a8cd8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#71767b',
      light: '#71767b',
      dark: '#536471',
      contrastText: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#16181c',
    },
    text: {
      primary: '#e7e9ea',
      secondary: '#71767b',
    },
    divider: 'rgb(47, 51, 54)',
    action: {
      hover: 'rgba(255, 255, 255, 0.1)',
      selected: 'rgba(255, 255, 255, 0.2)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#16181c',
          boxShadow: 'none',
          border: '1px solid rgb(47, 51, 54)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#1d1f23',
            borderColor: 'rgb(47, 51, 54)',
            cursor: 'pointer',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(22, 24, 28, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgb(47, 51, 54)',
          boxShadow: 'none',
          '& .MuiToolbar-root': {
            minHeight: '64px',
            padding: '0 24px',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          height: '36px',
          minWidth: '36px',
          border: '1px solid rgb(47, 51, 54)',
          borderRadius: '18px',
          padding: '0 12px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(29, 155, 240, 0.1)',
            color: '#1d9bf0',
            '&:hover': {
              backgroundColor: 'rgba(29, 155, 240, 0.2)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '0 16px',
          minHeight: '64px',
          '@media (min-width: 600px)': {
            minHeight: '64px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px',
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1a8cd8',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#000000',
            '& fieldset': {
              borderColor: 'rgb(47, 51, 54)',
            },
            '&:hover fieldset': {
              borderColor: 'rgb(47, 51, 54)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1d9bf0',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#000000',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          border: '1px solid rgb(47, 51, 54)',
        },
      },
    },
  },
});

// Export both themes
export { lightTheme, darkTheme };

// Export default theme (light theme)
export const theme = lightTheme;
