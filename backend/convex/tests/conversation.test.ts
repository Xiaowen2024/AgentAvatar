import { startConversationMessage } from '../agentConversation';
import { ActionCtx } from '../_generated/server';
import { GameId } from '../ids';
import * as memory from '../Memory/memoryHelper';
import * as embeddingsCache from '../Memory/embeddingsCache';
import * as chatUtil from '../util/llm';
import 'jest';

// Mock dependencies
jest.mock('./memory');
jest.mock('./embeddingsCache');
jest.mock('../util/llm');

describe('startConversationMessage', () => {
  let ctx: ActionCtx; 
  let conversationId: GameId<'conversations'>;
  let playerId: GameId<'players'>;
  let otherPlayerId: GameId<'players'>;

  beforeEach(() => {
    ctx = {
      runQuery: jest.fn(),
    } as unknown as ActionCtx;
    conversationId = 'c:1' as GameId<'conversations'>;
    playerId = 'p:1' as GameId<'players'>;
    otherPlayerId = 'p:2' as GameId<'players'>;

    // Mock implementations
    (ctx.runQuery as jest.Mock).mockResolvedValue({
      player: { name: 'Player1', id: playerId },
      otherPlayer: { name: 'Player2' },
      agent: { identity: 'Agent1', plan: 'Plan1' },
      otherAgent: { identity: 'Agent2', plan: 'Plan2' },
      lastConversation: { created: Date.now() - 1000 * 60 * 60 * 24 },
    });

    (embeddingsCache.fetch as jest.Mock).mockResolvedValue('embedding');
    (memory.searchMemories as jest.Mock).mockResolvedValue([
      { data: { type: 'conversation', playerIds: [otherPlayerId] }, description: 'Memory1' },
    ]);
    (chatUtil.chatCompletion as jest.Mock).mockResolvedValue({ content: 'Hello, Player2!' });
  });

  it('should generate a conversation message', async () => {
    const result = await startConversationMessage(ctx, conversationId, playerId, otherPlayerId);
    expect(result).toBe('Hello, Player2!');
    expect(ctx.runQuery).toHaveBeenCalledWith(expect.any(Function), {
      playerId,
      otherPlayerId,
      conversationId,
    });
    expect(embeddingsCache.fetch).toHaveBeenCalledWith(ctx, 'Player1 is talking to Player2');
    expect(memory.searchMemories).toHaveBeenCalledWith(ctx, playerId, 'embedding', expect.any(Number));
    expect(chatUtil.chatCompletion).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gpt-4',
      messages: expect.any(Array),
      max_tokens: 50,
      stop: expect.any(Array),
    }));
  });
});