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
      light: '#8b98a5',
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
      hover: 'rgba(239, 243, 244, 0.1)',
      selected: 'rgba(239, 243, 244, 0.2)',
      disabled: '#3e4144',
      disabledBackground: '#0c0c0c',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#16181c',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#16181c',
          boxShadow: 'none',
          border: '1px solid rgb(47, 51, 54)',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#1d1f23',
            borderColor: 'rgb(62, 65, 68)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgb(47, 51, 54)',
          boxShadow: 'none',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#16181c',
          borderRight: '1px solid rgb(47, 51, 54)',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '1px solid rgb(47, 51, 54)',
          borderRadius: '9999px',
          color: '#e7e9ea',
          '&.Mui-selected': {
            backgroundColor: 'rgba(29, 155, 240, 0.1)',
            color: '#1d9bf0',
            '&:hover': {
              backgroundColor: 'rgba(29, 155, 240, 0.15)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(239, 243, 244, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: 'rgba(239, 243, 244, 0.1)',
          },
        },
        contained: {
          backgroundColor: '#1d9bf0',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1a8cd8',
          },
          '&.Mui-disabled': {
            backgroundColor: '#0c0c0c',
            color: '#3e4144',
          },
        },
        outlined: {
          borderColor: 'rgb(47, 51, 54)',
          color: '#e7e9ea',
          '&:hover': {
            borderColor: 'rgb(62, 65, 68)',
            backgroundColor: 'rgba(239, 243, 244, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#000000',
            color: '#e7e9ea',
            '& fieldset': {
              borderColor: 'rgb(47, 51, 54)',
            },
            '&:hover fieldset': {
              borderColor: 'rgb(62, 65, 68)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1d9bf0',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#71767b',
            '&.Mui-focused': {
              color: '#1d9bf0',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#16181c',
          border: '1px solid rgb(47, 51, 54)',
          '& .MuiDialogTitle-root': {
            color: '#e7e9ea',
          },
          '& .MuiDialogContent-root': {
            color: '#e7e9ea',
          },
        },
      },
    },
  },
});

// Export both themes
export { lightTheme, darkTheme };

// Export default theme (light theme)
export const theme = lightTheme;
