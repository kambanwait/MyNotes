<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({
  name: 'home',
  middleware: ['auth'],
})

const { user } = useUserSession()

// Notes
const { selectedNote, fetchingAllNotes } = storeToRefs(useNotesStore())
const { fetchAllUserNotes } = useNotesStore()

onMounted(async () => {
  if (user.value) await fetchAllUserNotes(user.value.id)
})

</script>

<template>  
    </template>
</template>