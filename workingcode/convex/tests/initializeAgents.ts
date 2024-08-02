import {Agent} from '../Agent/agent';
import { mutation, action } from "../_generated/server";
import { v } from "convex/values";
import { client } from "../client";
import { api } from "../_generated/api";



const agentsData = [
    {
        playerId: 'p:1',
        worldId: "w:1",
        playerName: 'John Doe',
        baseKnowledgeInfo: {
            age: 25,
            gender: 'male',
            ethnicity: 'white',
            selfDescription: 'a software engineer',
        },
        basePersonalityInfo: {
            introversion: 30,
            openness: 60,
            conscientiousness: 60,
            agreeableness: 80,
            neuroticism: 30,
            keywords: ['quiet', "kind", "helpful", "patient"],
            values: ["stability", "family", "health", "growth"]
        },
        baseSkillsInfo: {
            skills: ['software engineering', 'data science', 'machine learning'],
        },
        inProgressOperation: undefined,
    },
    {
        playerId: 'p:2',
        worldId: "w:1",
        playerName: 'Jane Smith',
        baseKnowledgeInfo: {
            age: 30,
            gender: 'female',
            ethnicity: 'asian',
            selfDescription: 'a dancer',
        },
        basePersonalityInfo: {
            introversion: 60,
            openness: 30,
            conscientiousness: 70,
            agreeableness: 30,
            neuroticism: 60,
            keywords: ['outgoing', 'energetic', 'creative', 'curious'],
            values: ["freedom", "love", "family", "compassion"]
        },
        baseSkillsInfo: {
           skills: ['dancing', 'acting', 'singing'],
          
        },
        inProgressOperation: undefined,
    },
    {
        playerId: 'p:3',
        worldId: "w:1",
        playerName: 'Alex Johnson',
        baseKnowledgeInfo: {
            age: 35,
            gender: 'non-binary',
            ethnicity: 'hispanic',
            selfDescription: 'a startup founder',
        },
        basePersonalityInfo: {
            introversion: 40,
            openness: 90,
            conscientiousness: 80,
            agreeableness: 70,
            neuroticism: 40,
            keywords: ['insightful', 'innovative', 'driven', 'visionary'],
            values: ['achivement', 'independence', 'family', 'status']
        },
        baseSkillsInfo: {
            skills: ['entrepreneurship', 'product development', 'strategic planning'],
        },
        inProgressOperation: undefined,
    },
    {
        playerId: 'p:4',
        worldId: "w:1",
        playerName: 'Emily Brown',
        baseKnowledgeInfo: {
            age: 40,
            gender: 'female',
            ethnicity: 'black',
            selfDescription: 'a high school physics teacher',
        },
        basePersonalityInfo: {
            introversion: 50,
            openness: 70,
            conscientiousness: 90,
            agreeableness: 90,
            neuroticism: 20,
            keywords: ['kind', 'caring', 'patient', 'dedicated'],
            values: ['education', 'compassion', 'community', 'growth']
        },
        baseSkillsInfo: {
            skills: ['teaching', 'physics', 'mentoring'],
        },
        inProgressOperation: undefined,
    }
    
];
  
// push agent data to agents table 
async function initializeAgents() {
    const agentData = agentsData[3]; // choose which agent to initialize
    console.log('Sending data:', { agentData, worldId: "w:1" });
    try {
        const taskId = await client.mutation(api.Agent.agent.initializeAgents, { agentData });
        console.log(taskId);
    } catch (error) {
        console.error('Error initializing agents:', error);
    }
}


initializeAgents();