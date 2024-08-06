import React from 'react';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonalityTest from './PersonalityTest.tsx';
import Onboarding from './Onboarding.tsx';
import ValueTest from './ValueTest.tsx';
import Initialization from './Initialization.tsx';
import './App.css';


const convex = new ConvexReactClient("https://tremendous-okapi-985.convex.cloud");
const App = () => {
  return (
    <ConvexProvider client={convex}>
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
    </ConvexProvider>
  );
};

export default App;