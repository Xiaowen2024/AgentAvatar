import { ObjectType, v } from 'convex/values';
import { GameId, parseGameId, conversationId, playerId} from './ids.js';
import { ConversationMembership, serializedConversationMembership } from './conversationMembership';
import { parseMap, serializeMap } from './util/object';


export class Conversation {
  id: GameId<'conversations'>;
  creator: GameId<'players'>;
  created: number;
  isTyping?: {
    playerId: GameId<'players'>;
    messageUuid: string;
    since: number;
  };
  lastMessage?: {
    author: GameId<'players'>;
    timestamp: number;
  };
  numMessages: number;
  participants: Map<GameId<'players'>, ConversationMembership>;

  constructor(serialized: SerializedConversation) {
    const { id, creator, created, isTyping, lastMessage, numMessages, participants } = serialized;
    this.id = parseGameId('conversations', id);
    this.creator = parseGameId('players', creator);
    this.created = created;
    this.isTyping = isTyping && {
      playerId: parseGameId('players', isTyping.playerId),
      messageUuid: isTyping.messageUuid,
      since: isTyping.since,
    };
    this.lastMessage = lastMessage && {
      author: parseGameId('players', lastMessage.author),
      timestamp: lastMessage.timestamp,
    };
    this.numMessages = numMessages;
    this.participants = parseMap(participants, ConversationMembership, (m: { playerId: any; }) => m.playerId);
  }

  

}

export const serializedConversation = {
    id: conversationId,
    creator: playerId,
    created: v.number(),
    isTyping: v.optional(
      v.object({
        playerId,
        messageUuid: v.string(),
        since: v.number(),
      }),
    ),
    lastMessage: v.optional(
      v.object({
        author: playerId,
        timestamp: v.number(),
      }),
    ),
    numMessages: v.number(),
    participants: v.array(v.object(serializedConversationMembership)),
  };
  export type SerializedConversation = ObjectType<typeof serializedConversation>;
