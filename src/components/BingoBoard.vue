<template>
    <v-container class="bg-grey-lighten-3 rounded-lg elevation-2">
        <v-row
          aligh="center"
          justify="space-between"
        >
        
          <h2 class="mb-2 ml-2">Números Chamados</h2>
        
        </v-row>
        <v-row>
          <v-col
            v-for="number in numbers"
            :key="number"
          >
          <div class="bg-white elevation-3 rounded-circle" :class="{'bg-yellow': isHighlighted(number)}" style="width: 45px; height: 45px">
            <v-col class="text-center">
                {{ number }}
            </v-col>
          </div>
            
          </v-col>
        </v-row>
      </v-container>
</template>

<script lang="ts" setup>
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1); 
    const props = defineProps({
        highlightedNumbers: {
            type: Array, 
            required: true
        }
    })
    
    const isHighlighted = (number: number) => {
        return props.highlightedNumbers.includes(number);
      };
</script>

