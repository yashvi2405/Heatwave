import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Alerts from './pages/Alerts';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/alerts"     element={<Alerts />} />
          <Route path="/login"      element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
