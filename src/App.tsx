import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Converter from './components/Converter';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import CookieConsent from './components/CookieConsent';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="/privacy" element={<PrivacyPolicy darkMode={darkMode} onBack={() => window.history.back()} />} />
          <Route path="/terms" element={<TermsOfService darkMode={darkMode} onBack={() => window.history.back()} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} onBack={() => window.history.back()} />} />
        </Routes>
        <CookieConsent darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;
