import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CompanySelection from './pages/CompanySelection';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 
import ResumePage from './pages/ResumePage';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Difficulty from './pages/Difficulty';
import Interview from './pages/Interview';

import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/profile" element={<Profile />} /> 
             <Route path="/companies" element={<CompanySelection />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route path="/difficulty" element={<Difficulty />} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
    </>
  );
}

export default App;