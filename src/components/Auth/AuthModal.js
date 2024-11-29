import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import zxcvbn from 'zxcvbn';
import { signIn, signUp } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
const AuthModal = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const { currentUser } = useAuth();
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
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must include uppercase, lowercase, number, and special character'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required')
    });
    // Login Form
    const { control: loginControl, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLoginForm } = useForm({
        resolver: yupResolver(loginSchema)
    });
    // Signup Form
    const { control: signupControl, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors }, reset: resetSignupForm, watch: watchSignup } = useForm({
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
    const onLogin = async (data) => {
        try {
            await signIn(data.email, data.password);
            resetLoginForm();
            onClose();
            setErrorMessage(null);
        }
        catch (error) {
            console.error('Login failed', error);
            setErrorMessage(error.message || 'Login failed. Please try again.');
        }
    };
    // Signup Handler
    const onSignup = async (data) => {
        try {
            await signUp(data.email, data.password, data.displayName);
            resetSignupForm();
            onClose();
            setErrorMessage(null);
        }
        catch (error) {
            console.error('Signup failed', error);
            setErrorMessage(error.message || 'Signup failed. Please try again.');
        }
    };
    // Close error message
    const handleCloseError = () => {
        setErrorMessage(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx(Modal, { open: open, onClose: onClose, "aria-labelledby": "auth-modal-title", children: _jsxs(Box, { sx: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }, children: [_jsx(Typography, { id: "auth-modal-title", variant: "h6", component: "h2", align: "center", gutterBottom: true, children: "StudyFlow Authentication" }), _jsxs(Tabs, { value: activeTab, onChange: (_, newValue) => {
                                setActiveTab(newValue);
                                setErrorMessage(null);
                            }, centered: true, children: [_jsx(Tab, { label: "Login" }), _jsx(Tab, { label: "Sign Up" })] }), activeTab === 0 && (_jsxs("form", { onSubmit: handleLoginSubmit(onLogin), children: [_jsx(Controller, { name: "email", control: loginControl, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, margin: "normal", label: "Email", variant: "outlined", error: !!loginErrors.email, helperText: loginErrors.email?.message })) }), _jsx(Controller, { name: "password", control: loginControl, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, margin: "normal", label: "Password", type: showPassword ? 'text' : 'password', variant: "outlined", error: !!loginErrors.password, helperText: loginErrors.password?.message, InputProps: {
                                            endAdornment: (_jsx(IconButton, { onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }))
                                        } })) }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", fullWidth: true, sx: { mt: 2 }, children: "Login" })] })), activeTab === 1 && (_jsxs("form", { onSubmit: handleSignupSubmit(onSignup), children: [_jsx(Controller, { name: "displayName", control: signupControl, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, margin: "normal", label: "Display Name (Optional)", variant: "outlined" })) }), _jsx(Controller, { name: "email", control: signupControl, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, margin: "normal", label: "Email", variant: "outlined", error: !!signupErrors.email, helperText: signupErrors.email?.message })) }), _jsx(Controller, { name: "password", control: signupControl, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, margin: "normal", label: "Password", type: showPassword ? 'text' : 'password', variant: "outlined", error: !!signupErrors.password, helperText: signupErrors.password?.message, InputProps: {
                                            endAdornment: (_jsx(IconButton, { onClick: () => setShowPassword(!showPassword), edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }))
                                        } })) }), _jsx(Box, { sx: {
                                        height: 5,
                                        width: '100%',
                                        backgroundColor: passwordStrength === 0 ? 'lightgray' :
                                            passwordStrength === 1 ? 'red' :
                                                passwordStrength === 2 ? 'orange' :
                                                    passwordStrength === 3 ? 'yellow' :
                                                        'green',
                                        marginTop: 1,
                                        marginBottom: 1
                                    } }), _jsx(Controller, { name: "confirmPassword", control: signupControl, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, fullWidth: true, margin: "normal", label: "Confirm Password", type: showPassword ? 'text' : 'password', variant: "outlined", error: !!signupErrors.confirmPassword, helperText: signupErrors.confirmPassword?.message })) }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", fullWidth: true, sx: { mt: 2 }, children: "Sign Up" })] }))] }) }), _jsx(Snackbar, { open: !!errorMessage, autoHideDuration: 6000, onClose: handleCloseError, anchorOrigin: { vertical: 'top', horizontal: 'center' }, children: _jsx(Alert, { onClose: handleCloseError, severity: "error", sx: { width: '100%' }, children: errorMessage }) })] }));
};
export default AuthModal;
