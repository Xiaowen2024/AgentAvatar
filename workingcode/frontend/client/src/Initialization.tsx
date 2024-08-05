import React, { useState, useEffect,  useContext } from 'react';
import { ScoresContext } from './ScoresContext.tsx';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const QuestionContainer = styled.div`
  margin-bottom: 20px;
`;

const QuestionText = styled.p`
  font-size: 16px;
  color: #555;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #2196f3;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1769aa; 
  }
    
  &:active,
  &:focus {
    background-color: #1769aa; // Change color to blueish when button is clicked
  }
`;

const SubmitButton = styled(Button)`
  display: block;
  width: 30%;
  margin: 20px auto 0;  // Updated to center the button
  background-color: #1769aa;

  &:hover {
    background-color:  #145a8a;
  }

`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 8px;
  width: 50%;
  box-sizing: border-box;
`;


const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 8px;
  width: 50%;
  box-sizing: border-box;
`;

const Textarea = styled.textarea` // Changed from styled.input to styled.textarea
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 8px;
  width: 50%;
  box-sizing: border-box;
  resize: vertical; // Added to allow the textarea to be resized vertically
`;

interface BaseKnowledgeInfo {
  age: number;
  gender: string;
  ethnicity: string;
  selfDescription: string;
}

interface BaseSkillsInfo {
  skills: string[];
}

interface BasePersonalityInfo {
    introversion: number; 
    openness: number;
    conscientiousness: number;
    agreeableness: number;
    neuroticism: number;
    conformity: number;
    tradition: number;
    benevolence: number;
    universalism: number;
    selfdirection: number;
    stimulation: number;
    hedonism: number;
    achievement: number;
    power: number;
    security: number;
    interests: Array<string>; 
}

interface SerializedAgent {
  playerId: string;
  worldId: string;
  playerName: string;
  baseKnowledgeInfo: BaseKnowledgeInfo;
  baseSkillsInfo: BaseSkillsInfo;
  basePersonalityInfo: BasePersonalityInfo;
}

const Initialization: React.FC = () => {
  const [agentInfo, setAgentInfo] = useState<SerializedAgent>({
    playerId: '',
    worldId: '',
    playerName: '',
    baseKnowledgeInfo: {
      age: 0,
      gender: '',
      ethnicity: '',
      selfDescription: '',
    },
    baseSkillsInfo: {
      skills: [],
    },
    basePersonalityInfo: {
      introversion: 0,
      openness: 0,
      conscientiousness: 0,
      agreeableness: 0,
      neuroticism: 0,
      conformity: 0,
      tradition: 0,
      benevolence: 0,
      universalism: 0,
      selfdirection: 0,
      stimulation: 0,
      hedonism: 0,
      achievement: 0,
      power: 0,
      security: 0,
      interests: [],
    },
  });

  const scores = useContext(ScoresContext);

  useEffect(() => {
    const fetchedPersonality = {
        introversion: (scores as any).introversion, 
        openness: (scores as any).openness,
        conscientiousness: (scores as any).conscientiousness,
        agreeableness: (scores as any).agreeableness,
        neuroticism: (scores as any).neuroticism,
    };
    const fetchedValues = {
        conformity: (scores as any).conformity,
        tradition: (scores as any).tradition,
        benevolence: (scores as any).benevolence,
        universalism: (scores as any).universalism,
        selfdirection: (scores as any).selfDirection,
        stimulation: (scores as any).stimulation,
        hedonism: (scores as any).hedonism,
        achievement: (scores as any).achievement,
        power: (scores as any).power,
        security: (scores as any).security
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgentInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKnowledgeInfoChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgentInfo(prev => ({
        ...prev,
        baseKnowledgeInfo: {
            ...prev.baseKnowledgeInfo,
            [name]: name === 'age' ? parseInt(value) : value,
        },
    }));
};

    
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setAgentInfo(prev => ({
      ...prev,
      baseSkillsInfo: {
        ...prev.baseSkillsInfo,
        skills,
      },
    }));
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(interest => interest.trim());
    setAgentInfo(prev => ({
      ...prev,
      basePersonalityInfo: {
        ...prev.basePersonalityInfo,
        interests,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Agent Info:', agentInfo);
  };

  return (
    <Container>
        
    <form onSubmit={handleSubmit}>
    <Title>Agent Information</Title>
    <QuestionContainer>
      <div>
        <label htmlFor="playerName">Player Name:</label>
        <Input
          type="text"
          id="playerName"
          name="playerName"
          value={agentInfo.playerName}
          onChange={handleInputChange}
          required
        />
      </div>

      <h3>Base Knowledge Info</h3>
      <div>
        <label htmlFor="age">Age:</label>
        <Input
          type="number"
          id="age"
          name="age"
          value={agentInfo.baseKnowledgeInfo.age.toString()} // Convert age to string
          onChange={handleKnowledgeInfoChange as any}
          required
        />
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <Select
          id="gender"
          name="gender"
          value={agentInfo.baseKnowledgeInfo.gender}
          onChange={handleKnowledgeInfoChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="NonBinary">Non-Binary</option>
        </Select>
      </div>
      <div>
        <label htmlFor="ethnicity">Ethnicity:</label>
        <Select
          id="ethnicity"
          name="ethnicity"
          value={agentInfo.baseKnowledgeInfo.ethnicity}
          onChange={handleKnowledgeInfoChange}
          required
        >
          <option value="">Select Ethnicity</option>
          <option value="Asian">Asian</option>
          <option value="Black">Black</option>
          <option value="Hispanic">Hispanic</option>
          <option value="White">White</option>
          <option value="Native American">Native American</option>
          <option value="Pacific Islander">Pacific Islander</option>
          <option value="Middle Eastern">Middle Eastern</option>
          <option value="Mixed">Mixed</option>
          <option value="Other">Other</option>
        </Select>
      </div>
      <div>
        <label htmlFor="selfDescription">Self Description:</label>
        <Textarea
          id="selfDescription"
          name="selfDescription"
          value={agentInfo.baseKnowledgeInfo.selfDescription}
          onChange={handleKnowledgeInfoChange}
          required
        />
      </div>

      <h3>Skills</h3>
      <div>
        <label htmlFor="skills">Skills (comma-separated):</label>
        <Input
          type="text"
          id="skills"
          name="skills"
          value={agentInfo.baseSkillsInfo.skills.join(', ')}
          onChange={handleSkillsChange}
          required
        />
      </div>

      <h3>Interests</h3>
      <div>
        <label htmlFor="interests">Interests (comma-separated):</label>
        <Input
          type="text"
          id="interests"
          name="interests"
          value={agentInfo.basePersonalityInfo.interests.join(', ')}
          onChange={handleInterestsChange}
          required
        />
      </div>

      <h3>Personality (Auto-filled from previous test)</h3>
      <div>
        <p>Introversion: {(scores as any).introversion}</p>
        <p>Openness: {(scores as any).openness}</p>
        <p>Conscientiousness: {(scores as any).conscientiousness}</p>
        <p>Agreeableness: {(scores as any).agreeableness}</p>
        <p>Neuroticism: {(scores as any).neuroticism}</p>
      </div>

      <h3>Personality (Auto-filled from previous test)</h3>
      <div>
        <p>Conformity: {(scores as any).conformity}</p>
        <p>Tradition: {(scores as any).tradition}</p>
        <p>Benevolence: {(scores as any).benevolence}</p>
        <p>Universalism: {(scores as any).universalism}</p>
        <p>Self-Direction: {(scores as any).selfdirection}</p>
        <p>Stimulation: {(scores as any).stimulation}</p>
        <p>Hedonism: {(scores as any).hedonism}</p>
        <p>Achievement: {(scores as any).achievement}</p>
        <p>Power: {(scores as any).power}</p>
        <p>Security: {(scores as any).security}</p>
      </div>
    
      </QuestionContainer>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </form>
    </Container>
  );
};

export default Initialization;