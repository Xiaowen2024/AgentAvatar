import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ScoresContext } from "./ScoresContext.tsx";
import { useLocation } from 'react-router-dom';

const valueQuestions = [
  "Thinking up new ideas and being creative is important to me. I like to do things in my own original way.",
  "It is important to me to be rich. I want to have a lot of money and expensive things.",
  "I think it is important that every person in the world should be treated equally. I believe everyone should have equal opportunities in life.",
  "It's important to me to show my abilities. I want people to admire what I do.",
  "It is important to me to live in secure surroundings. I avoid anything that might endanger my safety.",
  "I like surprises and am always looking for new things to do. I think it is important to do lots of different things in life.",
  "I believe that people should do what they're told. I think people should follow rules at all times, even when no one is watching.",
  "It is important to me to listen to people who are different from me. Even when I disagree with them, I still want to understand them.",
  "It is important to me to be humble and modest. I try not to draw attention to myself.",
  "Having a good time is important to me. I like to \"spoil\" myself.",
  "It is important to me to make my own decisions about what I do. I like to be free and not depend on others.",
  "It's very important to me to help the people around me. I want to care for their well-being.",
  "Being very successful is important to me. I hope people will recognize my achievements.",
  "It is important to me that the government ensures my safety against all threats. I want the state to be strong so it can defend its citizens.",
  "I look for adventures and like to take risks. I want to have an exciting life.",
  "It is important to me always to behave properly. I want to avoid doing anything people would say is wrong.",
  "It is important to me to get respect from others. I want people to do what I say.",
  "It is important to me to be loyal to my friends. I want to devote myself to people close to me.",
  "I strongly believe that people should care for nature. Looking after the environment is important to me.",
  "Tradition is important to me. I try to follow the customs handed down by my religion or my family.",
  "I seek every chance I can to have fun. It is important to me to do things that give me pleasure."
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
  &:focus,
  &:active:focus {
    background-color: #1769aa; // Change color to blueish when button is clicked
  }
`;

const SubmitButton = styled(Button)`
  display: block;
  width: 30%;
  margin: 20px auto 0;
  background-color: #1769aa;

  &:hover {
    background-color:  #145a8a;
  }
`;


const valueMappings: { [key: string]: number[] } = {
    "conformity": [7, 16],
    "tradition": [9, 20],
    "benevolence": [12, 18],
    "universalism": [3, 8, 19],
    "selfdirection": [1, 11],
    "stimulation": [6, 15],
    "hedonism": [10, 21],
    "achievement": [4, 13],
    "power": [2, 17],
    "security": [5, 14]
};

// type ButtonState = { [key: number]: string };

// const ValueTest: React.FC = () => {
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [responses, setResponses] = useState<number[]>(new Array(valueQuestions.length).fill(0));
//   const [selectedButtons, setSelectedButtons] = useState<ButtonState>({});
//   const { setScores } = useContext(ScoresContext);
//   const navigate = useNavigate();
//     const handleAnswerClick = (index: number, response: number) => {
//         if (index > 0) {
//             const newResponses = [...responses];
//             newResponses[index - 1] = response;
//             setResponses(newResponses);
//         }
//         const newSelectedButtons = { ...selectedButtons };
//         newSelectedButtons[index] = response.toString();
//         setSelectedButtons(newSelectedButtons);
//     };

//     const calculateValues = () => {
//         const valueScores: { [key: string]: number } = {};
//         for (const value in valueMappings) {
//             const questions = valueMappings[value];
//             let rawScore = 0;
//             for (const questionIndex of questions) {
//                 rawScore += responses[questionIndex - 1];
//             }
//             const percentile = (rawScore / (6 * questions.length)) * 100;
//             valueScores[value] = percentile;
//         }
//         displayResults(valueScores);
//         setScores(valueScores);
//         navigate('/initialization');
//     };

//     const displayResults = (valueScores: { [key: string]: number }) => {
//         for (const value in valueScores) {
//             console.log(`${value} Percentile: ${valueScores[value]}`);
//         }
//     };

//     const getAllScores = (valueScores: { [key: string]: number }): { [key: string]: number } => {
//         let allScores: { [key: string]: number } = {};
//         for (let i = 0; i < valueQuestions.length; i++) {
//             allScores[valueQuestions[i]] = responses[i];
//         }
//         return allScores;
//     };

type ButtonState = { [key: number]: string };

const ValueTest: React.FC = () => {
  const [responses, setResponses] = useState<number[]>(new Array(valueQuestions.length).fill(0));
  const [selectedButtons, setSelectedButtons] = useState<ButtonState>({});
  const location = useLocation();
  const personalityScores = location.state?.scores;
  const navigate = useNavigate();

  const handleAnswerClick = (index: number, response: number) => {
    const newResponses = [...responses];
    newResponses[index] = response;
    setResponses(newResponses);

    const newSelectedButtons = { ...selectedButtons };
    newSelectedButtons[index] = response.toString();
    setSelectedButtons(newSelectedButtons);
  };

  const handleSubmit = () => {
    const valueScores = calculateValues();
    localStorage.setItem('valueScores', JSON.stringify(valueScores));

    navigate('/initialization');
  };

  const calculateValues = () => {
    let valueScores : { [key: string]: number } = {};
    for (const value in valueMappings) {
      const questions = valueMappings[value];
      let rawScore = 0;
      for (const questionIndex of questions) {
        rawScore += responses[questionIndex - 1];
      }
      const percentile = (rawScore / (6 * questions.length)) * 100;
      valueScores[value] = percentile;
    }
    return valueScores;

    
  };

  return (
    <Container>
      <Title>Value Test</Title>
      <p>  The scale consists of 21 short verbal portraits describing the importance of different values. For each item, please indicate how much you agree with the statements, with 1 indicating "not like me at all" and 6 indicating "very much like me".</p>
      {valueQuestions.map((question, index) => (
        <QuestionContainer key={index}>
          <QuestionText>{question}</QuestionText>
          {[1, 2, 3, 4, 5, 6].map((value) => (
            <Button key={value} onClick={() => handleAnswerClick(index, value)}
            style={{ backgroundColor: selectedButtons[index] === value.toString() ? '#1769aa' : '#2196f3' }} >
              {value}
            </Button>
          ))}
        </QuestionContainer>
      ))}
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Container>
  );
};

export default ValueTest;