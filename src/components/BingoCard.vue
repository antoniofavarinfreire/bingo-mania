<template>
    <v-col md="5">
      <v-card class="bg-grey-lighten-3">
        <v-card-title :key="titleCardGame">
          <h3>{{ titleCardGame }}</h3>
        </v-card-title>
        <v-card-text style="padding: 0.4rem !important">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in bingoTable" :key="rowIndex">
              <td v-for="(num, colIndex) in row" :key="colIndex" class="px-2 py-2">
                <v-btn :class="{'bg-yellow' : isHighlighted(num ?? 0)}">
                  {{ num }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-card-text>
      </v-card>
      <div>
        <v-btn @click="resetGame">Reiniciar</v-btn>
      </div>
    </v-col>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, ref, watch, type Ref } from 'vue';
  import { liveQuery } from 'dexie';
  import { useObservable, from } from '@vueuse/rxjs';
  import { db, type Player } from '../db'; // Certifique-se de que Player está sendo exportado de db.ts
  
  const columns = ['B', 'I', 'N', 'G', 'O'];
  
  const props = defineProps({
    numbers: { type: Array as () => number[], required: true },
    titleCardGame: { type: String, required: true },
    highlightedNumbers: { type: Array as () => number[], required: true }
  });
  
  const isLoaded = ref(false);
  const observableBingoTable = useObservable(
    from(
      liveQuery(async () => {
        return await db.player.toArray();
      })
    )
  ) as Ref<Player[]>;
  
  const bingoTable = ref<(number | null)[][]>([]);
  const generateTable = (numbers: number[]) => {
    return generateBingoTable(numbers);
  }
  
  const isHighlighted = (number: number) => {
    return props.highlightedNumbers.includes(number);
  };
  
  const addBoard = async (columnB: (number | null)[], columnI: (number | null)[], columnN: (number | null)[], columnG: (number | null)[], columnO: (number | null)[]) => {
    try {
      await db.player.add({
        b: columnB.join(','),
        i: columnI.join(','),
        n: columnN.join(','),
        g: columnG.join(','),
        o: columnO.join(',')
      });
    } catch (error) {
      console.error("Error adding board to database:", error);
    }
  };
  
  const resetGame = async () => {
    isLoaded.value = true;
    await db.player.clear();
    bingoTable.value = generateTable(props.numbers);
    await addBoard(bingoTable.value[0], bingoTable.value[1], bingoTable.value[2], bingoTable.value[3], bingoTable.value[4]);
  };
  
  function distributeNumbers(number: number[]): (number | null)[][] {
    const columnB: (number | null)[] = [];
    const columnI: (number | null)[] = [];
    const columnN: (number | null)[] = [];
    const columnG: (number | null)[] = [];
    const columnO: (number | null)[] = [];
  
    number.forEach(num => {
      if (num >= 1 && num <= 15) {
        if (columnB.length < 5) columnB.push(num);
      } else if (num >= 16 && num <= 30) {
        if (columnI.length < 5) columnI.push(num);
      } else if (num >= 31 && num <= 45) {
        if (columnN.length < 4) columnN.push(num);
      } else if (num >= 46 && num <= 60) {
        if (columnG.length < 5) columnG.push(num);
      } else if (num >= 61 && num <= 75) {
        if (columnO.length < 5) columnO.push(num);
      }
    });
  
    return [columnB, columnI, columnN, columnG, columnO];
  }
  
  function generateBingoTable(numbers: number[]): (number | null)[][] {
    const [columnB, columnI, columnN, columnG, columnO] = distributeNumbers(numbers);
  
    const cleanedColumnB = columnB.filter((num): num is number => num !== null);
    const cleanedColumnI = columnI.filter((num): num is number => num !== null);
    const cleanedColumnN = columnN.filter((num): num is number => num !== null);
    const cleanedColumnG = columnG.filter((num): num is number => num !== null);
    const cleanedColumnO = columnO.filter((num): num is number => num !== null);
  
    const table: (number | null)[][] = [];
    for (let i = 0; i < 5; i++) {
      const row: (number | null)[] = [];
      row.push(columnB[i] ?? null);
      row.push(columnI[i] ?? null);
      row.push(i === 2 ? null : columnN[i < 2 ? i : i - 1] ?? null);
      row.push(columnG[i] ?? null);
      row.push(columnO[i] ?? null);
      table.push(row);
    }
  
    return table;
  }
  
  watch(
    observableBingoTable,
    async (newVal: Player[]) => {
      if (newVal && newVal.length > 0) {
        const playerData = newVal[0];
        bingoTable.value = [
          playerData.b.split(',').map(Number),
          playerData.i.split(',').map(Number),
          playerData.n.split(',').map(Number),
          playerData.g.split(',').map(Number),
          playerData.o.split(',').map(Number)
        ];
      } else {
        bingoTable.value = generateTable(props.numbers);
        await addBoard(bingoTable.value[0], bingoTable.value[1], bingoTable.value[2], bingoTable.value[3], bingoTable.value[4]);
      }
    },
    { immediate: true }
  );
  </script>
  