import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonalityTest from './PersonalityTest.tsx';
import Onboarding from './Onboarding.tsx';
import ValueTest from './ValueTest.tsx';
import Initialization from './Initialization.tsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/personalitytest" element={<PersonalityTest />} />
          <Route path="/valuetest" element={<ValueTest />} />
          <Route path="/initialization" element={<Initialization />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;