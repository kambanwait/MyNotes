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
  <main
    class="h-screen text-gray-500 grid grid-rows-[minmax(320px,_350px)_1fr] md:grid-rows-1 md:grid-cols-[320px_1fr]"
  > 
    <template v-if="user">
      <HomeSide :fetching="fetchingAllNotes" :selected-note="selectedNote" />
    </template>

    <HomeMain :selected-note="selectedNote" />
  </main>
</template>