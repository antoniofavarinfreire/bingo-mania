import Dexie , {type EntityTable } from 'dexie';

interface Player {
  id: number;
  b: string;
  i: string;
  n: string;
  g: string;
  o: string;
  highlightedNumbers: string;
}

interface Machine {
  id: number;
  b: string;
  i: string;
  n: string;
  g: string;
  o: string;
  highlightedNumbers: string;
}

interface Board {
  id: number;
  highlightedNumbers: string;
}

const db = new Dexie('BingoDatabase') as Dexie & {
  player: EntityTable<
    Player,
    'id'
  >;
}

db.version(1).stores({
  player: '++id, b, i, n, g, o, highlightedNumbers',
});

export type { Player };
export { db };