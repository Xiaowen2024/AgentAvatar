import { GameId, parseGameId, textinputId, playerId, agentId} from '../ids';
import { Game, IdManager } from '../game';
import { ObjectType, v } from 'convex/values';
import { MutationCtx, internalMutation, internalQuery } from '../_generated/server';
import { internal } from '../_generated/api';
import { FunctionArgs } from 'convex/server';

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
    skills: Array<string>;

    constructor(skills: Array<string>) {
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
    keywords: Array<string>; // keywords that describe the personality such as energetic, creative, etc.

    constructor(introversion: number, openness: number, conscientiousness: number, agreeableness: number, neuroticism: number, keywords: Array<string>) {
        this.introversion = introversion;
        this.openness = openness;
        this.conscientiousness = conscientiousness;
        this.agreeableness = agreeableness;
        this.neuroticism = neuroticism;
        this.keywords = keywords;
    }
}

export class InProgressOperation {
    name?: string;
    operationId?: string;
    started?: number;

    constructor(name: string, operationId: string, started: number) {
        this.name = name;
        this.operationId = operationId;
        this.started = started;
    }
}

export const serializedAgent = {
    id: agentId,
    playerId: playerId,
    baseKnowledgeInfo: v.object(
        {
            age: v.number(),
            gender: v.string(),
            ethnicity: v.string(),
            selfDescription: v.string()
        }
    ),
    baseSkillsInfo: 
        v.object(
            {
                skills: v.array(v.string())
            }
        ),
    basePersonalityInfo: 
        v.object(
            {
                introversion: v.number(),
                openness: v.number(),
                conscientiousness: v.number(),
                agreeableness: v.number(),
                neuroticism: v.number(),
                keywords: v.array(v.string())
            }
        ), 

    inProgressOperation: v.optional(v.object({
            name: v.string(),
            operationId: v.string(),
            started: v.number()
    }))
};

export class Agent {
    id: GameId<'agents'>;
    playerId: GameId<'players'>;
    baseKnowledgeInfo: SerializedAgent['baseKnowledgeInfo'];
    baseSkillsInfo: SerializedAgent['baseSkillsInfo'];
    basePersonalityInfo: SerializedAgent['basePersonalityInfo'];
    inProgressOperation?: SerializedAgent['inProgressOperation'];

   
    constructor(serialized: SerializedAgent) {
        this.id = parseGameId('agents', serialized.id);
        this.playerId = parseGameId('players', serialized.playerId);
        this.baseKnowledgeInfo = { ...serialized.baseKnowledgeInfo };
        this.baseSkillsInfo = { ...serialized.baseSkillsInfo };
        this.basePersonalityInfo = { ...serialized.basePersonalityInfo };
        if (serialized.inProgressOperation) {
            this.inProgressOperation = { ...serialized.inProgressOperation };
        }
    }

    serialize(): SerializedAgent {
        return {
            id: this.id,
            playerId: this.playerId,
            baseKnowledgeInfo: this.baseKnowledgeInfo,
            baseSkillsInfo: this.baseSkillsInfo,
            basePersonalityInfo: this.basePersonalityInfo,
            ...(this.inProgressOperation && { inProgressOperation: this.inProgressOperation })
        };
    }
    

    // startOperation<Name extends keyof AgentOperations>(
    //     game: Game,
    //     time: number,
    //     name: Name,
    //     args: Omit<FunctionArgs<AgentOperations[Name]>, 'operationId'>,
    // ) {
    //     const idManager = IdManager.getInstance();
    //     if (this.inProgressOperation) {
    //     throw new Error(
    //         `Agent ${this.id} already has an operation: ${JSON.stringify(this.inProgressOperation)}`,
    //     );
    //     }
    //     const operationId = idManager.allocId('operations');
    //     console.log(`Agent ${this.id} starting operation ${String(name)} (${operationId})`);
    //     game.scheduleOperation(String(name), { operationId, ...args } as any);
    //     this.inProgressOperation = {
    //     name: name as string,
    //     operationId,
    //     started: time as number,
    //     };
    // }

}; 

export type SerializedAgent = ObjectType<typeof serializedAgent>;

// type AgentOperations = typeof internal.agentOperations;

    