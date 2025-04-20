<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import type { Note } from '~/types/notes.type';

const toast = useToast()
const props = defineProps<{
  selectedNote: Note | null
}>()

const { updateNote } = useNotesStore()
const { updatingNote } = storeToRefs(useNotesStore())

const updatedNote = ref<Note['text'] | undefined>('');
const formattedDate = (date: Date) => {
  return useDateFormat(date, 'DD/MM/YYYY').value;
};

watch(
  () => props.selectedNote,
  (newNote, oldNote) => {
    // console.log(newNote)
    // console.log(oldNote)
    
    if (newNote?.id !== oldNote?.id) {
      updatedNote.value = newNote?.text
    };
  })

onMounted(() => {
  updatedNote.value = props.selectedNote?.text
})

const handleUpdateNote = async () => {
  if (props.selectedNote) {
    const response = await updateNote(updatedNote.value as string, props.selectedNote?.id)

    if (response?.ok) {
      toast.add({
        title: 'Updated note',
        description: "Note was updated",
        color: 'success',
        duration: 2000,
      })
    }
    
  }
}
</script>

<template>
  <section class="p-5 grid grid-rows-[25px_1fr] gap-10">
    <header class="flex justify-between">
      <UButton
        label="Create note"
        :icon="'i-lucide-pencil-line'"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <UButton
        label=""
        :icon="'i-lucide-trash'"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </header>

    <main
      v-if="selectedNote"
      class="my-10 mx-auto w-full text-center grid grid-rows-[auto_1fr] gap-5"
    >
      <small
        class="text-zinc-500 text-left w-full max-w-3xl mx-auto font-semibold"
      >
        Created: {{ formattedDate(selectedNote.createdAt as Date) }} / Updated:
        {{ formattedDate(selectedNote.updatedAt as Date) }}
      </small>
      <textarea
        v-model="updatedNote"
        class="text-zinc-400 w-full max-w-3xl mx-auto h-full !border-none !bg-transparent focus:outline-0"
        placeholder="Start typing..."
      />

      <UButton
        v-if="updatedNote !== props.selectedNote?.text"
        label="Save note"
        class="w-fit place-self-end"
        color="success"
        size="lg"
        :loading="updatingNote"
        @click="handleUpdateNote"
      />
    </main>

  </section>
</template>