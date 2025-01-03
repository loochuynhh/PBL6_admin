import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import {} from 'react-router-dom';
import AdminLayout from './layouts/admin';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import Forgot from 'views/auth/forgotPass';
import SignIn from 'views/auth/signIn';
import FloatingChatbot from './components/chatbot/Chatbot'; 
// Chakra imports

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <FloatingChatbot />
      <Routes>
        <Route path="auth/sign-in" element={<SignIn />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="auth/forgot-password" element={<Forgot />} />
      </Routes>
    </ChakraProvider>
  );
}
