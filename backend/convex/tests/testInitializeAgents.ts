import {Agent} from '../Memory/agent';
import { mutation, action } from "../_generated/server";
import { v } from "convex/values";
import { client } from "../client";
import { api } from "../_generated/api";


const agentsData = [
    {
        playerId: 'p:1',
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
        },
        baseSkillsInfo: {
            skills: ['software engineering', 'data science', 'machine learning'],
        },
        inProgressOperation: undefined,
    },
    {
        playerId: 'p:2',
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
        },
        baseSkillsInfo: {
            skills: ['business analysis', 'project management', 'leadership'],
        },
        inProgressOperation: undefined,
    }
];


  

async function testInitializeAgents() {
    console.log(JSON.stringify(api, null, 2));
    const agentData = agentsData[1];
    const taskId = await client.mutation(api.Agent.agent.initializeAgents, { agentData });
    console.log(taskId);
}


testInitializeAgents();