<template>
    <v-container>
        <v-col>
            <v-row>
                <BingoBoard :numbers="playerBoard"/>
            </v-row>
        </v-col>
    </v-container>
</template>

<script lang="ts" setup>
    import BingoBoard from '../components/BingoBoard.vue'
    import { ref } from 'vue'
    const generateUniqueBoards = () => {
    // Cria um array de números de 1 a 75
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    
    // Embaralha os números
    const shuffledNumbers = shuffle(allNumbers);

    // Seleciona 25 números para o jogador e 25 para a máquina
    const playerNumbers = shuffledNumbers;
    const machineNumbers = shuffledNumbers.slice(25, 50);

    return { playerNumbers};
    }

    // Função para embaralhar um array
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

    const { playerNumbers} = generateUniqueBoards();
    const playerBoard = ref<number[]>(playerNumbers);
</script>