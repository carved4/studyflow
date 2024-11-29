import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Tabs, 
  Tab,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import zxcvbn from 'zxcvbn';

import { signIn, signUp } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useIOSKeyboard } from '../../hooks/useIOSKeyboard'; // Import the useIOSKeyboard hook

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

interface LoginFormInputs {
  email: string;
  password: string;
}

interface SignupFormInputs extends LoginFormInputs {
  confirmPassword: string;
  displayName?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Use iOS keyboard hook
  useIOSKeyboard();

  // Style adjustments for iOS
  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    WebkitOverflowScrolling: 'touch' as const,
  };

  const inputProps = {
    style: {
      WebkitAppearance: 'none' as const,
      borderRadius: '4px',
      fontSize: '16px',
    },
    className: 'no-select',
  };

  // Login Schema
  const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required')
  });

  // Signup Schema
  const signupSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    displayName: yup.string().optional(),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must include uppercase, lowercase, number, and special character'
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Login Form
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema)
  });

  // Signup Form
  const {
    control: signupControl,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignupForm,
    watch: watchSignup
  } = useForm<SignupFormInputs>({
    resolver: yupResolver(signupSchema)
  });

  // Password strength calculation
  const watchPassword = watchSignup('password');
  React.useEffect(() => {
    if (watchPassword) {
      const result = zxcvbn(watchPassword);
      setPasswordStrength(result.score);
    }
  }, [watchPassword]);

  // Login Handler
  const onLogin = async (data: LoginFormInputs) => {
    try {
      await signIn(data.email, data.password);
      resetLoginForm();
      onClose();
      setErrorMessage(null);
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  // Signup Handler
  const onSignup = async (data: SignupFormInputs) => {
    try {
      await signUp(data.email, data.password, data.displayName);
      resetSignupForm();
      onClose();
      setErrorMessage(null);
    } catch (error) {
      console.error('Signup failed', error);
      setErrorMessage(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    }
  };

  // Close error message
  const handleCloseError = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="auth-modal-title"
        disableAutoFocus // Prevent unwanted focus on iOS
      >
        <Box sx={modalStyle} className="scroll-container">
          <Typography id="auth-modal-title" variant="h6" component="h2" align="center" gutterBottom>
            StudyFlow Authentication
          </Typography>

          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => {
              setActiveTab(newValue);
              setErrorMessage(null);
            }}
            centered
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Login Form */}
          {activeTab === 0 && (
            <form onSubmit={handleLoginSubmit(onLogin)}>
              <Controller
                name="email"
                control={loginControl}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...inputProps}
                    fullWidth
                    margin="normal"
                    label="Email"
                    variant="outlined"
                    error={!!loginErrors.email}
                    helperText={loginErrors.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={loginControl}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...inputProps}
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!loginErrors.password}
                    helperText={loginErrors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                )}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 1 && (
            <form onSubmit={handleSignupSubmit(onSignup)}>
              <Controller
                name="displayName"
                control={signupControl}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...inputProps}
                    fullWidth
                    margin="normal"
                    label="Display Name (Optional)"
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="email"
                control={signupControl}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...inputProps}
                    fullWidth
                    margin="normal"
                    label="Email"
                    variant="outlined"
                    error={!!signupErrors.email}
                    helperText={signupErrors.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={signupControl}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...inputProps}
                    fullWidth
                    margin="normal"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!signupErrors.password}
                    helperText={signupErrors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      )
                    }}
                  />
                )}
              />
              {/* Password Strength Meter */}
              <Box sx={{ 
                height: 5, 
                width: '100%', 
                backgroundColor: passwordStrength === 0 ? 'lightgray' :
                  passwordStrength === 1 ? 'red' :
                  passwordStrength === 2 ? 'orange' :
                  passwordStrength === 3 ? 'yellow' :
                  'green',
                marginTop: 1,
                marginBottom: 1
              }} />
              <Controller
                name="confirmPassword"
                control={signupControl}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...inputProps}
                    fullWidth
                    margin="normal"
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!signupErrors.confirmPassword}
                    helperText={signupErrors.confirmPassword?.message}
                  />
                )}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </form>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthModal;
