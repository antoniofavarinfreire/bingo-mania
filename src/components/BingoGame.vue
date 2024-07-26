<template>
    <v-container>
        <v-col>
            <v-col cols="11">
                <v-row align="center" justify="center">
                    <BingoBoard :highlightedNumbers="highlightedNumbers"/>
                </v-row>
            </v-col>
            <v-row class="mt-4">
                <v-btn @click="startGeneration">Iniciar jogo</v-btn>
            </v-row>
            <v-row align="start" justify="start" class="mt-3">
                <BingoCard v-model:highlightedNumbers="highlightedNumbers" :title-card-game="'Jogador'" :numbers="playerBoard"/>
                <BingoCard v-model:highlightedNumbers="highlightedNumbers" :title-card-game="'Maquina'" :numbers="machineBoard"/>
            </v-row>
        </v-col>
    </v-container>
</template>

<script lang="ts" setup>
    import BingoCard from './BingoCard.vue'
    import BingoBoard from './BingoBoard.vue'
    import { ref } from 'vue'

    const drawnNumber = ref<number | null>(null);
    const highlightedNumbers = ref<number[]>([]);



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

    const playerBoard = generateUniqueBoards();
    const machineBoard = generateUniqueBoards();
    const generationInterval = ref<number | null>(null);

    const drawNumber = () => {
      const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1).filter(num => !highlightedNumbers.value.includes(num));
      if (availableNumbers.length === 0) return;
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      drawnNumber.value = availableNumbers[randomIndex];
      highlightedNumbers.value.push(drawnNumber.value);
    //   if (machineBoard.includes(drawnNumber.value) && !machineHighlightedNumbers.value.includes(drawnNumber.value)) {
    //     machineHighlightedNumbers.value.push(drawnNumber.value);
    //   }

    //   checkWinners();
    };

    const startGeneration = () => {
        drawNumber();
    //     if (!generationInterval.value) {
    //     generationInterval.value = window.setInterval(drawNumber, 1000);
    //   }
    };
    
</script>