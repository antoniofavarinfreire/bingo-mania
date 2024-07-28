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
                <v-btn v-if="!(rowIndex === 2 && colIndex === 2)" :class="{'bg-yellow' : isHighlighted(num ?? 0)}">
                  {{ num }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-card-text>
      </v-card>
    </v-col>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, ref } from 'vue';

const columns = ['B', 'I', 'N', 'G', 'O'];

const props = defineProps({
    numbers: { type: Array as () => number[], required: true },
    titleCardGame: { type: String, required: true},
    highlightedNumbers: { type: Array, required: true}
});

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

    const table: (number | null)[][] = [];

    for (let i = 0; i < 5; i++) {
        const row: (number | null)[] = [];
        row.push(columnB[i] ?? null);
        row.push(columnI[i] ?? null);
        row.push(i === 2 ? null : columnN[i < 2 ? i : i - 1] ?? null); // Free space in the middle
        row.push(columnG[i] ?? null);
        row.push(columnO[i] ?? null);
        table.push(row);
    }

    return table;
}


const isHighlighted = (number: number) => {
  return props.highlightedNumbers.includes(number);
};

const bingoTable = generateBingoTable(props.numbers);
  
  </script>
  