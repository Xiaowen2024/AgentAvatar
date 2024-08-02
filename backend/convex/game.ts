import { GameId, IdTypes, allocGameId } from './ids';


export class IdManager {
    private static instance: IdManager;
    private nextId: number;
  
    private constructor(initialId: number = 0) {
      this.nextId = initialId;
    }
  
    public static getInstance(initialId: number = 0): IdManager {
      if (!IdManager.instance) {
        IdManager.instance = new IdManager(initialId);
      }
      return IdManager.instance;
    }
  
    public allocId<T extends IdTypes>(idType: T): GameId<T> {
      const id = allocGameId(idType, this.nextId);
      this.nextId += 1;
      return id;
    }
  
    public setNextId(nextId: number) {
      this.nextId = nextId;
    }
  
    public getNextId(): number {
      return this.nextId;
    }
}


export class Game {
    pendingOperations: Array<{ name: string; args: any }> = [];

    scheduleOperation(name: string, args: unknown) {
        this.pendingOperations.push({ name, args });
    }
}