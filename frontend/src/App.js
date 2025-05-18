import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './components/ThemeContext'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './dashboard/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Program from './dashboard/Program';
import CardMember from './dashboard/CardMember';
import UserProgram from './dashboard/UserPrograms';
import List from './dashboard/List';
import Card from './dashboard/Card';
import Schedule from './pages/Schedule';
import MyPrograms from './pages/MyPrograms';
import CreateAppointment from './pages/CreateAppointment';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
const AppRoutes = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>

      <Route path="*" element={<Navigate to="/" />} />

        <Route path="/" element={<Home />} />
      <Route path="/Schedule" element={<Schedule />} />
        <Route path="/login" element={<Login />} />
                <Route path="/CreateAppointment" element={<CreateAppointment />} />
        <Route path="/MyAppointments" element={<MyAppointments />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/programs" element={<Program />} />
        <Route path="/userprograms" element={<UserProgram />} />
        <Route path="/list" element={<List />} />
        <Route path="/card" element={<Card />} />
                <Route path="/MyPrograms" element={<MyPrograms />} />
        <Route path="/cardmember" element={<CardMember/>}/>
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
