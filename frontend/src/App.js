import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'; 
import logo from './assests/LogoNan-IA.png';
import LoginPage from './components/LoginPage';
import Dashboard from './components/DashBoard';


function LandingPage() {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo NaN-Ai" className="logo" />
        </div>
      </header>
      <main className="main-content">
        <h2>Bienvenido a tu aplicación</h2>
        <p>La mejor solución para la gestión de ventas.</p>
        <Link to="/login" className="login-button-link">
          <button className="login-button">Iniciar Sesión</button>
        </Link>
      </main>
      <footer className="footer">
        <p>&copy; 2024 NaN-Ai. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
