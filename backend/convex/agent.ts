import { GameId, parseGameId } from './ids.js';

enum Gender {
    Male = 'Male',
    Female = 'Female',
    NonBinary = 'NonBinary'
}

enum Ethnicity {
    Asian = 'Asian',
    Black = 'Black',
    Hispanic = 'Hispanic',
    White = 'White',
    NativeAmerican = 'Native American',
    PacificIslander = 'Pacific Islander',
    MiddleEastern = 'Middle Eastern',
    Mixed = 'Mixed',
    Other = 'Other'
}

export class baseKnowledge {
    age: number;
    gender: Gender;
    ethnicity: Ethnicity;
    selfDescription: string; // core description about this agent such as base memory 

    constructor(age: number, gender: Gender, ethnicity: Ethnicity, selfDescription: string) {
        this.age = age;
        this.gender = gender;
        this.ethnicity = ethnicity;
        this.selfDescription = selfDescription;
    }
}

export class baseSkills {
    skills: string[];

    constructor(skills: string[]) {
        this.skills = skills;
    }
}

export class basePersonality {
    introversion: number; // 0 - 100 introverted to extroverted 
    openness: number; // 0 - 100 closed to open to new experiences
    conscientiousness: number; // 0 - 100 disorganized to organized
    agreeableness: number; // 0 - 100 antagonistic to agreeable
    neuroticism: number; // 0 - 100 emotionally stable to emotionally unstable
    // self-reported personality keywords
    keywords: string[]; // keywords that describe the personality such as energetic, creative, etc.

    constructor(introversion: number, openness: number, conscientiousness: number, agreeableness: number, neuroticism: number, keywords: string[]) {
        this.introversion = introversion;
        this.openness = openness;
        this.conscientiousness = conscientiousness;
        this.agreeableness = agreeableness;
        this.neuroticism = neuroticism;
        this.keywords = keywords;
    }
}

export class Agent {
    id: GameId<'agents'>;
    playerId: GameId<'players'>;
    baseKnowledge: baseKnowledge;
    baseSkills: baseSkills;
    basePersonality: basePersonality;

    constructor(serialized: SerializedAgent) {
        this.id = parseGameId('agents', serialized.id);
        this.playerId = parseGameId('players', serialized.playerId);
        this.baseKnowledge = new baseKnowledge(serialized.baseKnowledge.age, serialized.baseKnowledge.gender, serialized.baseKnowledge.ethnicity, serialized.baseKnowledge.selfDescription);
        this.baseSkills = new baseSkills(serialized.baseSkills.skills);
        this.basePersonality = new basePersonality(
            serialized.basePersonality.introversion,
            serialized.basePersonality.openness,
            serialized.basePersonality.conscientiousness,
            serialized.basePersonality.agreeableness,
            serialized.basePersonality.neuroticism,
            serialized.basePersonality.keywords
        );
    }
}

export const serializedAgent = {
    id: 'agent1',
    playerId: 'player1',
    baseKnowledge: { age: 30, gender: Gender.Male, ethnicity: Ethnicity.Asian, selfDescription: 'An experienced engineer.' },
    baseSkills: { skills: ['coding', 'debugging'] },
    basePersonality: { introversion: 50, openness: 70, conscientiousness: 80, agreeableness: 60, neuroticism: 40, keywords: ['analytical', 'diligent'] }
};

export type SerializedAgent = typeof serializedAgent;
