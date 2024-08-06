import {Agent} from '../Agent/agent';
import { mutation, action } from "../_generated/server";
import { v } from "convex/values";
import { client } from "../client";
import { api } from "../_generated/api";

// const agentsData = [
//   {
//     playerId: 'p:1',
//     worldId: "w:1",
//     playerName: 'Olivia Chen',
//     baseKnowledgeInfo: {
//       age: 28,
//       gender: 'female',
//       ethnicity: 'asian',
//       selfDescription: 'A dedicated environmental scientist with a focus on marine ecology. Passionate about ocean conservation and reducing plastic pollution. Enjoy scuba diving, nature photography, and volunteering for beach cleanups. Strive to live a sustainable lifestyle and educate others about environmental issues.',
//     },
//     basePersonalityInfo: {
//       introversion: 60,
//       openness: 85,
//       conscientiousness: 75,
//       agreeableness: 70,
//       neuroticism: 40,
//       interests: ["marine biology", "sustainability", "photography", "hiking", "yoga"],
//       values: ["environmental protection", "education", "scientific integrity", "community"]
//     },
//     baseSkillsInfo: {
//       skills: ['marine ecology', 'data analysis', 'scientific research', 'public speaking', 'grant writing'],
//     },
//     inProgressOperation: undefined,
//   },
//   {
//     playerId: 'p:2',
//     worldId: "w:1",
//     playerName: 'Marcus Alvarez',
//     baseKnowledgeInfo: {
//       age: 34,
//       gender: 'male',
//       ethnicity: 'hispanic',
//       selfDescription: 'A passionate chef and restaurateur specializing in fusion cuisine that blends traditional Latin American flavors with modern culinary techniques. Dedicated to sourcing local, organic ingredients and promoting sustainable food practices. Love experimenting with new recipes, exploring farmer\'s markets, and mentoring aspiring chefs.',
//     },
//     basePersonalityInfo: {
//       introversion: 40,
//       openness: 80,
//       conscientiousness: 70,
//       agreeableness: 75,
//       neuroticism: 50,
//       interests: ["culinary innovation", "food sustainability", "wine tasting", "gardening", "food photography"],
//       values: ["creativity", "quality", "cultural preservation", "mentorship"]
//     },
//     baseSkillsInfo: {
//       skills: ['culinary arts', 'restaurant management', 'menu development', 'food styling', 'team leadership'],
//     },
//     inProgressOperation: undefined,
//   },
//   {
//     playerId: 'p:3',
//     worldId: "w:1",
//     playerName: 'Aisha Patel',
//     baseKnowledgeInfo: {
//       age: 31,
//       gender: 'female',
//       ethnicity: 'south asian',
//       selfDescription: 'A driven cybersecurity analyst working to protect digital infrastructures from emerging threats. Passionate about ethical hacking and educating individuals and organizations on best security practices. Enjoy participating in capture-the-flag competitions, developing secure coding practices, and mentoring women in tech.',
//     },
//     basePersonalityInfo: {
//       introversion: 65,
//       openness: 70,
//       conscientiousness: 85,
//       agreeableness: 60,
//       neuroticism: 45,
//       interests: ["ethical hacking", "AI in cybersecurity", "cryptography", "chess", "science fiction"],
//       values: ["digital privacy", "innovation", "continuous learning", "diversity in tech"]
//     },
//     baseSkillsInfo: {
//       skills: ['network security', 'penetration testing', 'threat analysis', 'programming (Python, C++)', 'security auditing'],
//     },
//     inProgressOperation: undefined,
//   },
//   {
//     playerId: 'p:4',
//     worldId: "w:1",
//     playerName: 'Liam O\'Connor',
//     baseKnowledgeInfo: {
//       age: 42,
//       gender: 'male',
//       ethnicity: 'white',
//       selfDescription: 'A dedicated social worker specializing in youth mental health and LGBTQ+ support services. Passionate about creating safe spaces for vulnerable youth and advocating for mental health awareness. Enjoy writing, practicing mindfulness, and organizing community outreach programs.',
//     },
//     basePersonalityInfo: {
//       introversion: 45,
//       openness: 75,
//       conscientiousness: 80,
//       agreeableness: 90,
//       neuroticism: 35,
//       interests: ["psychology", "social justice", "meditation", "creative writing", "community organizing"],
//       values: ["empathy", "inclusivity", "mental well-being", "social equality"]
//     },
//     baseSkillsInfo: {
//       skills: ['counseling', 'crisis intervention', 'group therapy facilitation', 'advocacy', 'grant writing'],
//     },
//     inProgressOperation: undefined,
//   }
// ];

// push agent data to agents table 
// async function initializeAgents() {
//     const agentData = agentsData[2]; // choose which agent to initialize
//     console.log('Sending data:', { agentData, worldId: "w:1" });
//     try {
//         const taskId = await client.mutation(api.Agent.agent.initializeAgents, { agentData });
//         console.log(taskId);
//     } catch (error) {
//         console.error('Error initializing agents:', error);
//     }
// }


// initializeAgents();