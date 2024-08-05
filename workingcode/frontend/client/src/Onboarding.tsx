import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/personalitytest'); // Navigate to the personality test page
  };

  const styles: { [key: string]: CSSProperties } = {
    container: {
      textAlign: 'center',
      padding: '40px',
      maxWidth: '740px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    header: {
      color: '#333',
      fontSize: '32px',
      marginBottom: '20px',
    },
    paragraph: {
      margin: '15px 0',
      fontSize: '18px',
      color: '#555',
      lineHeight: '1.6',
    },
    button: {
      padding: '12px 24px',
      fontSize: '18px',
      cursor: 'pointer',
      backgroundColor: '#1769aa',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to AgentAvatar</h1>
      <p style={styles.paragraph}>
        Thank you for participating in our research project! 
      </p>
      <p style={{ ...styles.paragraph, marginBottom: '20px' }}>
      This project aims to create an AI agent that captures your personality, values, and interests, allowing you to observe and interact with a virtual representation of yourself. This AI agent will exhibit your behaviors and mental states within a dynamic multi-agent environment, providing insights into your own actions and responses in various social scenarios.
      </p>
      <p style={{ ...styles.paragraph, marginBottom: '20px' }}>
      To initialize your agents, we kindly ask you to complete a personality test, a value test, and provide some demographic information.
      Once initialized, you can continue to interact with your agents by sharing your thoughts and emotions or uploading significant imagery.
      </p>
      <p style={{ ...styles.paragraph, marginBottom: '20px' }}>
        Please take your time to consider the questions and respond honestly. Your participation is greatly appreciated!
      </p>
      <button 
        style={styles.button} 
        onClick={handleStartTest}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
      >
        Start Initialization 
      </button>
    </div>
  );
};

export default Onboarding;