import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ScoresContext } from "./ScoresContext.tsx";

const questions = [
  "I am someone who is compassionate, has a soft heart.",
  "I am someone who tends to be disorganized.",
  "I am someone who worries a lot.",
  "I am someone who is fascinated by art, music, or literature.",
  "I am someone who is dominant, acts as a leader.",
  "I am someone who is sometimes rude to others.",
  "I am someone who has difficulty getting started on tasks.",
  "I am someone who tends to feel depressed, blue.",
  "I am someone who has little interest in abstract ideas.",
  "I am someone who is full of energy.",
  "I am someone who assumes the best about people.",
  "I am someone who is reliable, can always be counted on.",
  "I am someone who is emotionally stable, not easily upset.",
  "I am someone who is original, comes up with new ideas."
];

const isReverse = [
  false, true, false, true, false, false, false, true, true, false, true, false, false, false, true, false
];

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
type ButtonState = { [key: number]: string };

const PersonalityTest: React.FC = () => {
  const [responses, setResponses] = useState<number[]>(new Array(questions.length).fill(0));
  const [selectedButtons, setSelectedButtons] = useState<ButtonState>({});
  const { setScores } = useContext(ScoresContext);
  const navigate = useNavigate();
  const handleResponse = (index: number, response: number) => {
    const newSelectedButtons = { ...selectedButtons };
    newSelectedButtons[index] = response.toString();
    setSelectedButtons(newSelectedButtons);
  };


  const calculateScores = () =>  {
    const extraversion = (5 - responses[0]) + responses[5] + responses[10];
    const agreeableness = responses[1] + (5 - responses[6]) + responses[11];
    const conscientiousness = (5 - responses[2]) + (5 - responses[7]) + responses[12];
    const negativeEmotionality = responses[3] + responses[8] + (5 - responses[13]);
    const openMindedness = responses[4] + (5 - responses[9]) + responses[14];
    const extraversionPercentile = (extraversion / 15) * 100;
    const agreeablenessPercentile = (agreeableness / 15) * 100;
    const conscientiousnessPercentile = (conscientiousness / 15) * 100;
    const negativeEmotionalityPercentile = (negativeEmotionality / 15) * 100;
    const openMindednessPercentile = (openMindedness / 15) * 100;
    console.log("Extraversion Percentile: " + extraversionPercentile);
    console.log("Agreeableness Percentile: " + agreeablenessPercentile);
    console.log("Conscientiousness Percentile: " + conscientiousnessPercentile);
    console.log("Negative Emotionality Percentile: " + negativeEmotionalityPercentile);
    console.log("Open-Mindedness Percentile: " + openMindednessPercentile);
    let scores : { [key: string]: number} = {};
    scores["introversion"] = 100 - extraversionPercentile;
    scores["agreeableness"] = agreeablenessPercentile;
    scores["conscientiousness"] = conscientiousnessPercentile;
    scores["neuroticism"] = negativeEmotionalityPercentile;
    scores["openness"] = openMindednessPercentile;
    setScores(scores);
  };

  const handleSubmit = () => {
    calculateScores();
    navigate('/valuetest');
  };

  return (
    <Container>
      <Title>Personality Test</Title>
      <p>Please choose whether you're more likely to agree or disagree with the below statements.</p>
      {questions.map((question, index) => (
        <QuestionContainer key={index}>
          <QuestionText>{question}</QuestionText>
          <Button onClick={() => handleResponse(index, 1)} style={{ backgroundColor: selectedButtons[index] === '1' ? '#1769aa' : '#2196f3' }}>True</Button>
         
          <Button onClick={() => handleResponse(index, 0)} style={{ backgroundColor: selectedButtons[index] === '0' ? '#1769aa' : '#2196f3' }}>False</Button>
        </QuestionContainer>
      ))}
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Container>
  );
};

export default PersonalityTest;