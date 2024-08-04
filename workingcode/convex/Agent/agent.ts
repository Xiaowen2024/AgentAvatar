import { GameId, parseGameId, textinputId, playerId, agentId, worldId} from '../ids';
import { Game, IdManager } from '../game';
import { ObjectType, v } from 'convex/values';
import { MutationCtx, internalMutation, internalQuery } from '../_generated/server';
import { internal } from '../_generated/api';
import { FunctionArgs } from 'convex/server';
import { mutation } from '../_generated/server';
import { Id } from '../_generated/dataModel';


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
    // self-reported personality interests
    interests: Array<string>; 
    values: Array<string>; // interests that describe the personality such as energetic, creative, etc.

        constructor(introversion: number, openness: number, conscientiousness: number, agreeableness: number, neuroticism: number, interests: Array<string>, values: Array<string>) {
        this.introversion = introversion;
        this.openness = openness;
        this.conscientiousness = conscientiousness;
        this.agreeableness = agreeableness;
        this.neuroticism = neuroticism;
        this.interests = interests;
        this.values = values;
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
    playerId: playerId,
    worldId: worldId,
    playerName: v.string(),
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
                interests: v.array(v.string()),
                values: v.array(v.string())
            }
        ), 

    inProgressOperation: v.optional(v.object({
            name: v.string(),
            operationId: v.string(),
            started: v.number()
    }))
};

export class Agent {
    playerId: GameId<'players'>;
    worldId: GameId<'worlds'>;
    playerName: SerializedAgent['playerName'];
    baseKnowledgeInfo: SerializedAgent['baseKnowledgeInfo'];
    baseSkillsInfo: SerializedAgent['baseSkillsInfo'];
    basePersonalityInfo: SerializedAgent['basePersonalityInfo'];
    inProgressOperation?: SerializedAgent['inProgressOperation'];

   
    constructor(serialized: SerializedAgent) {
        this.playerName = serialized.playerName;
        this.worldId = parseGameId('worlds', serialized.worldId);
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
            playerId: this.playerId,
            worldId: this.worldId,
            playerName: this.playerName,
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

const agentDataValidator = v.object({
    playerId: v.string(),
    worldId: v.string(),
    playerName: v.string(),
    baseKnowledgeInfo: v.object({
      age: v.number(),
      gender: v.string(),
      ethnicity: v.string(),
      selfDescription: v.string(),
    }),
    basePersonalityInfo: v.object({
      introversion: v.number(),
      openness: v.number(),
      conscientiousness: v.number(),
      agreeableness: v.number(),
      neuroticism: v.number(),
      interests: v.array(v.string()),
      values: v.array(v.string()), 
    }),
    baseSkillsInfo: v.object({
      skills: v.array(v.string()),
    }),
    inProgressOperation: v.optional(v.any()),
  });
    
export const initializeAgents = mutation({
    args: { agentData: agentDataValidator},
    handler: async (ctx, args) => {
      const agentData = { 
        ...args.agentData
      };
      const taskId = await ctx.db.insert("agents", agentData);
      return taskId;
    },
  });

export function toAgent(obj: any): Agent {
    return {
      ...obj,
      serialize: () => JSON.stringify(obj)
    };
  }