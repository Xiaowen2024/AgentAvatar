// import { familyGatheringResponse } from './conversation';
// import { GameId, parseGameId } from './ids';
// import { SerializedAgent } from './agent';

// // 模拟上下文对象
// const ctx = {
//   // ... 模拟上下文内容，例如数据库连接、日志记录等
// };

// // 定义代理数据
// const agent1: SerializedAgent = {
//   id: 'agent1',
//   playerId: 'player1',
//   baseKnowledge: { age: 30, gender: 'Male', ethnicity: 'Asian', selfDescription: 'An experienced engineer.' },
//   baseSkills: { skills: ['coding', 'debugging'] },
//   basePersonality: { introversion: 50, openness: 70, conscientiousness: 80, agreeableness: 60, neuroticism: 40, keywords: ['analytical', 'diligent'] }
// };

// const agent2: SerializedAgent = {
//   id: 'agent2',
//   playerId: 'player2',
//   baseKnowledge: { age: 25, gender: 'Female', ethnicity: 'White', selfDescription: 'A creative designer.' },
//   baseSkills: { skills: ['designing', 'drawing'] },
//   basePersonality: { introversion: 30, openness: 80, conscientiousness: 70, agreeableness: 75, neuroticism: 30, keywords: ['creative', 'friendly'] }
// };

// const agent3: SerializedAgent = {
//   id: 'agent3',
//   playerId: 'player3',
//   baseKnowledge: { age: 40, gender: 'Female', ethnicity: 'Black', selfDescription: 'A skilled manager.' },
//   baseSkills: { skills: ['management', 'communication'] },
//   basePersonality: { introversion: 60, openness: 60, conscientiousness: 90, agreeableness: 50, neuroticism: 45, keywords: ['organized', 'leader'] }
// };

// // 将代理数据存储在数组中
// const agentsData: SerializedAgent[] = [agent1, agent2, agent3];

// // 定义场景描述和初始对话
// const sceneDescription = "Evening dinner at the family table";
// const initialDialogue = "I'm so happy to be here with all of you!";
// const initialEmotion = "happy";
// const speakingAgentId = parseGameId('agents', 'agent1');

// // 初始对话和自我介绍
// async function initiateConversation() {
//   const initialResponses = await familyGatheringResponse(ctx, speakingAgentId, initialDialogue, initialEmotion, sceneDescription);
//   console.log("Initial Responses: ", initialResponses);

//   // 模拟多轮次对话
//   const subsequentDialogue = "What have you all been up to lately?";
//   const subsequentEmotion = "curious";
//   const subsequentResponses = await familyGatheringResponse(ctx, speakingAgentId, subsequentDialogue, subsequentEmotion, sceneDescription);
//   console.log("Subsequent Responses: ", subsequentResponses);
// }

// initiateConversation().catch(console.error);