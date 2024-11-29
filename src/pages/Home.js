import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Typography, Box } from '@mui/material';
const Home = () => {
    return (_jsx(Container, { maxWidth: "md", children: _jsxs(Box, { sx: { my: 4, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h2", component: "h1", gutterBottom: true, children: "Welcome to StudyFlow" }), _jsx(Typography, { variant: "h5", component: "p", color: "text.secondary", children: "Your personal academic productivity companion" })] }) }));
};
export default Home;
