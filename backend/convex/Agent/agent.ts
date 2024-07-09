import { GameId, parseGameId, textinputId, playerId} from './ids.js';

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
    selfDescription: string;

    constructor(age: number, gender: Gender, ethnicity: Ethnicity, selfDescription: string) {
        this.age = age;
        this.gender = gender;
        this.ethnicity = ethnicity;
        this.selfDescription = selfDescription;
    }
}

export class baseSkills {
    skills: List<string>;

    constructor(skills: List<string>) {
        this.skills = skills;
    }
}


export class basePersonality {
    // Big 5 personality traits
    introversion: number; // 0 - 100 introverted to extroverted 
    openness: number; // 0 - 100 closed to open to new experiences
    conscientiousness: number; // 0 - 100 disorganized to organized
    agreeableness: number; // 0 - 100 antagonistic to agreeable
    neuroticism: number; // 0 - 100 emotionally stable to emotionally unstable
    // self-reported personality keywords
    keywords: List<string>; // keywords that describe the personality such as energetic, creative, etc.

    constructor(introversion: number, openness: number, conscientiousness: number, agreeableness: number, neuroticism: number, keywords: List<string>) {
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
        const { id } = serialized;
        const playerId = parseGameId('players', serialized.playerId);
        this.id = parseGameId('agents', id);
        this.playerId = playerId;
        this.baseKnowledge = baseKnowledge;
        this.baseSkills = baseSkills;
        this.basePersonality = basePersonality;
    }
}  


export const serializedAgent = {
    id: agentId,
    playerId: playerId,
    baseKnowledge: baseKnowledge,
    baseSkills: baseSkills,
    basePersonality: basePersonality
  };
  export type SerializedAgent = ObjectType<typeof serializedAgent>;