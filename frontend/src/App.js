import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import MandiOptimizer from './pages/MandiOptimizer';
import ProfitTracker from './pages/ProfitTracker';
import Schemes from './pages/Schemes';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Weather from './pages/Weather';
import MandiMap from './pages/MandiMap';
import { useAuth } from './AuthContext';
import MSPAlert from './pages/MSPAlert';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public route — shows HomePage if not logged in, Dashboard if logged in */}
          <Route path="/" element={user ? <Dashboard /> : <HomePage />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/mandi" element={<MandiOptimizer />} />
          <Route path="/mandi-map" element={<MandiMap />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* Profit Tracker — only accessible after login */}
          <Route path="/profit" element={user ? <ProfitTracker /> : <Login />} />
          {/* Personal Dashboard — only after login */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
          <Route path="/msp" element={<MSPAlert />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;