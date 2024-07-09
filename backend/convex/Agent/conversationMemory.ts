import { GameId, parseGameId, textinputId, playerId, conversationId} from './ids.js';

export class ConversationMemory {
    id: GameId<'conversations'>;
    creator: GameId<'players'>;
    otherPlayer: GameId<'players'>;
}  

export const serializedConversationMemory = {
    id: conversationId,
    creator: playerId,
    otherPlayer: playerId
};

export type SerializedConversationMemory = ObjectType<typeof serializedConversationMemory>;