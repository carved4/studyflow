import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsx(Container, { maxWidth: "sm", children: _jsxs(Box, { sx: {
                my: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }, children: [_jsx(Typography, { variant: "h2", component: "h1", gutterBottom: true, children: "404 - Page Not Found" }), _jsx(Typography, { variant: "h5", component: "p", color: "text.secondary", align: "center", children: "Oops! The page you are looking for does not exist." }), _jsx(Button, { variant: "contained", color: "primary", sx: { mt: 4 }, onClick: () => navigate('/'), children: "Return to Home" })] }) }));
};
export default NotFound;
