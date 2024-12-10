<template>
  <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import iFrame from '@/components/iFrame'
import useUserStore from '@/store/modules/user';

const userStore = useUserStore()

console.log('🚀:>> ', userStore.address)

const url = ref(userStore.address)
</script>
