<template>
    <v-container>
        <v-col>
            <v-col cols="11">
                <v-row align="center" justify="center">
                    <BingoBoard :highlightedNumbers="state.highlightedNumbers"/>
                </v-row>
                <v-col>
                    <v-row justify="center" align="center" class="mt-4">    
                        <div class="text-center number-call"> 
                            {{ state.drawnNumber }}
                        </div>
                    </v-row>
                    <v-row justify="center" align="center" class="mt-4">
                        <v-btn @click="startGeneration">Chamar números</v-btn>
                    </v-row>
                </v-col>
                <v-row align="center" justify="space-between" class="mt-3">
                    <BingoCard v-model:highlightedNumbers="state.highlightedNumbers" :title-card-game="'Jogador'" :numbers="state.playerBoard"/>
                    <BingoCard v-model:highlightedNumbers="state.highlightedNumbers" :title-card-game="'Maquina'" :numbers="state.machineBoard"/>
                </v-row>
            </v-col>
            <v-dialog v-model="dialog" max-width="400px">
                <v-card >
                  <v-card-title class="headline">{{ state.winner }} venceu!</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn style="background-color: #6bf67b;" @click="resetGame">Reiniciar</v-btn>
                  </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-container>
</template>

<script lang="ts" setup>
    import BingoCard from './BingoCard.vue'
    import BingoBoard from './BingoBoard.vue'
    import { ref, computed } from 'vue'
    import { reactive } from 'vue';

    const state = reactive({
        drawnNumber: null as number | null,
        highlightedNumbers: [] as number[],
        winner: null as string | null,
        playerBoard: [] as number[],
        machineBoard: [] as number[],
        generationInterval: null as number | null
    });

    const dialog = computed(() => state.winner !== null);

    const generateUniqueBoards = () => {
    // Cria um array de números de 1 a 75
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    
    // Embaralha os números
    const shuffledNumbers = shuffle(allNumbers);

    // Seleciona 25 números para o jogador e 25 para a máquina
    const cardNumbers = shuffledNumbers;


    return  cardNumbers ;
    }

    // Função para embaralhar um arra
    const shuffle = (array: number[]): number[] => {
        let currentIndex = array.length, randomIndex;

        // Enquanto houver elementos a embaralhar
        while (currentIndex !== 0) {
            // Escolhe um elemento restante
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // Troca o elemento atual com o escolhido
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    state.playerBoard = generateUniqueBoards();
    state.machineBoard = generateUniqueBoards();
    const generationInterval = ref<number | null>(null);
    

    const drawNumber = () => {
      const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1).filter(num => !state.highlightedNumbers.includes(num));
      if (availableNumbers.length === 0) return;
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      state.drawnNumber = availableNumbers[randomIndex];
      state.highlightedNumbers.push(state.drawnNumber);
  

      checkWinners();
    };

    const startGeneration = () => {
        if(state.winner === null){
            drawNumber();
        }
    };

    const distributeNumbers = (numbers: number[]): (number | null)[][] => {
        const columnB: (number | null)[] = [];
        const columnI: (number | null)[] = [];
        const columnN: (number | null)[] = [];
        const columnG: (number | null)[] = [];
        const columnO: (number | null)[] = [];

        numbers.forEach(num => {
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
    };

    const checkWinners = () => {
        if (checkColumnCompleted(state.playerBoard)) {
            state.winner = 'Jogador';
            clearInterval(generationInterval.value!);
            generationInterval.value = null;
        } else if (checkColumnCompleted(state.machineBoard)) {
            state.winner = 'Maquina';
            clearInterval(generationInterval.value!);
            generationInterval.value = null;
        }
    };
    
    const checkColumnCompleted = (board: number[]) => {
        const columns = distributeNumbers(board);
        // Check columns
        for (let i = 0; i < 5; i++) {
            if (columns[i].every(num => num === null || state.highlightedNumbers.includes(num))) {
            return true;
            }
        }
    };

    const resetGame = () => {
        clearInterval(state.generationInterval!);
        state.drawnNumber = null;
        state.highlightedNumbers = [];
        state.winner = null;
        state.playerBoard = generateUniqueBoards();
        state.machineBoard = generateUniqueBoards();
        state.generationInterval = null;
    };
</script>

<style>
    .number-call{
        width: 17%; 
        height: 35px; 
        border-radius: 10px;
        border: solid 1px;
        padding-top: 5px;
        margin-left: 10px;
    }
</style>