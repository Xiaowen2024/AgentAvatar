import { GameId, parseGameId, textinputId, playerId} from './ids.js';

export class Agent {
    id: GameId<'agents'>;
    playerId: GameId<'players'>;
    baseKnowledge: string;
    baseSkills: List<string>;
    basePersonality: string;
    // inProgressOperation?: {
    //   name: string;
    //   operationId: string;
    //   started: number;
    // };
  
    constructor(serialized: SerializedAgent) {
    //   const { id, lastConversation, lastInviteAttempt, inProgressOperation } = serialized;
    //   const playerId = parseGameId('players', serialized.playerId);
    //   this.id = parseGameId('agents', id);
    //   this.playerId = playerId;
    //   this.toRemember =
    //     serialized.toRemember !== undefined
    //       ? parseGameId('conversations', serialized.toRemember)
    //       : undefined;
    //   this.lastConversation = lastConversation;
    //   this.lastInviteAttempt = lastInviteAttempt;
    //   this.inProgressOperation = inProgressOperation;
    }
}  