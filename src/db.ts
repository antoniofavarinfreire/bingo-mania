import Dexie from 'dexie';
import type { Table } from 'dexie';

interface Player {
  id: number;
  b: string;
  i: string;
  n: string;
  g: string;
  o: string;
}

interface Machine {
  id: number;
  b: string;
  i: string;
  n: string;
  g: string;
  o: string;
}

const db = new Dexie('BingoDatabase');
db.version(1).stores({
  player: 'id, b, i, n, g, o',
  machine: 'id, b, i, n, g, o',
});

const playerTable = db.table<Player, number>('player');
const machineTable = db.table<Machine, number>('machine');

export type { Player };
export type { Machine };
export { db, playerTable, machineTable };
