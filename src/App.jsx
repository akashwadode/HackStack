// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AppNavbar from './components/Navbar';
import AddProject from './pages/AddProject';
import PublicPortfolio from './pages/PublicPorfolio';

function LayoutWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavbar && <AppNavbar />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddProject />} />
        <Route path="/u/id/:userId" element={<PublicPortfolio />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}
