import React, { useState, useEffect,  useContext, } from 'react';
import { ScoresContext } from './ScoresContext.tsx';
import styled from 'styled-components';
import { Navigate, useLocation } from 'react-router-dom';
import { ConvexProvider, ConvexReactClient, useMutation} from "convex/react";
import { api } from 'backendapi';
import { useNavigate } from 'react-router-dom';

const convex = new ConvexReactClient("https://tremendous-okapi-985.convex.cloud");


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

const Initialization = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const savedValueScores = localStorage.getItem('valueScores');
        if (savedValueScores) {
          const valueScores = JSON.parse(savedValueScores);
          console.log(valueScores);
          setAgentInfo(prev => ({
            ...prev,
            basePersonalityInfo: {
              ...prev.basePersonalityInfo,
              ...valueScores,
            },
          }));
        }
      }, []);

      useEffect(() => {
        const savedValueScores = localStorage.getItem('personalityScores');
        if (savedValueScores) {
          const personalityScores = JSON.parse(savedValueScores);
          console.log(personalityScores);
          setAgentInfo(prev => ({
            ...prev,
            basePersonalityInfo: {
              ...prev.basePersonalityInfo,
              ...personalityScores,
            },
          }));
        }
      }, []);


    
    const [agentInfo, setAgentInfo] = useState({
      playerId: 'p:5',
      worldId: 'w:2',
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
        agreeableness: 0,
        conscientiousness: 0,
        neuroticism: 0,
        openness: 0,
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
  
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setAgentInfo(prev => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleKnowledgeInfoChange = (e) => {
      const { name, value } = e.target;
      setAgentInfo(prev => ({
        ...prev,
        baseKnowledgeInfo: {
          ...prev.baseKnowledgeInfo,
          [name]: name === 'age' ? parseInt(value) : value,
        },
      }));
    };
  
    const handleSkillsChange = (e) => {
      const skills = e.target.value.split(',').map(skill => skill.trim());
      setAgentInfo(prev => ({
        ...prev,
        baseSkillsInfo: {
          ...prev.baseSkillsInfo,
          skills,
        },
      }));
    };
  
    const handleInterestsChange = (e) => {
      const interests = e.target.value.split(',').map(interest => interest.trim());
      setAgentInfo(prev => ({
        ...prev,
        basePersonalityInfo: {
          ...prev.basePersonalityInfo,
          interests,
        },
      }));
    };

    const UseAgentInitialization = () => {
        const initializeAgentsFunction = useMutation(api.Agent.agent.initializeAgents);
      
        const initializeAgents = async (agentInfo) => {
          try {
            const taskId = await initializeAgentsFunction({ agentData: agentInfo });
            return taskId;
          } catch (error) {
            console.error('Error initializing agents:', error);
            return null;
          }
        };
      
        return { initializeAgents };
      };
  
    const { initializeAgents } = UseAgentInitialization();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const taskId = await initializeAgents(agentInfo);
        console.log()
      } catch (error) {
        console.error('Error initializing agents:', error);
      }
      navigate('/update');
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
            <p>Introversion: {agentInfo.basePersonalityInfo.introversion}</p>
            <p>Openness: {agentInfo.basePersonalityInfo.openness}</p>
            <p>Conscientiousness: {agentInfo.basePersonalityInfo.conscientiousness}</p>
            <p>Agreeableness: {agentInfo.basePersonalityInfo.agreeableness}</p>
            <p>Neuroticism: {agentInfo.basePersonalityInfo.neuroticism}</p>
          </div>
    
          <h3>Personality (Auto-filled from previous test)</h3>
          <div>
            <p>Conformity: {agentInfo.basePersonalityInfo.conformity}</p>
            <p>Tradition: {agentInfo.basePersonalityInfo.tradition}</p>
            <p>Benevolence: {agentInfo.basePersonalityInfo.benevolence}</p>
            <p>Universalism: {agentInfo.basePersonalityInfo.universalism}</p>
            <p>Self-Direction: {agentInfo.basePersonalityInfo.selfdirection}</p>
            <p>Stimulation: {agentInfo.basePersonalityInfo.stimulation}</p>
            <p>Hedonism: {agentInfo.basePersonalityInfo.hedonism}</p>
            <p>Achievement: {agentInfo.basePersonalityInfo.achievement}</p>
            <p>Power: {agentInfo.basePersonalityInfo.power}</p>
            <p>Security: {agentInfo.basePersonalityInfo.security}</p>
          </div>
        
          </QuestionContainer>
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        </form>
        </Container>
      );
    };
    
  
  export default Initialization;