import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { api } from 'backendapi';

const convex = new ConvexReactClient("https://tremendous-okapi-985.convex.cloud");

const UpdatePage: React.FC = () => {
  const [content, setContent] = useState<string>(''); // State to manage the content
  const [selectedButton, setSelectedButtons] = useState<string>();
  const handleButtonClick = (type: string) => {
    setSelectedButtons(type);
    setContent(type);
  };

  const renderContent = () => {
    switch (content) {
      case 'talk':
        return <div>Talk Content</div>;
      case 'journal':
        return <div>Journal Content</div>;
      case 'picture':
        return <div>Picture Content</div>;
      default:
        return <div>Select an option below</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', borderTop: '1px solid #ccc' }}>
        <button onClick={() => handleButtonClick('talk')} style={{ backgroundColor: selectedButton === 'talk' ? '#1769aa' : '#2196f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Talk</button>
        <button onClick={() => handleButtonClick('journal')} style={{ backgroundColor: selectedButton === 'journal' ? '#1769aa' : '#2196f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Journal</button>
        <button onClick={() => handleButtonClick('picture')} style={{ backgroundColor: selectedButton === 'picture' ? '#1769aa' : '#2196f3', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Picture</button>
      </div>
    </div>
  );
};

export default UpdatePage;