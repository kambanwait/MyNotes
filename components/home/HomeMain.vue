<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useDateFormat } from '@vueuse/core'
import type { Note } from '~/types/notes.type';

const props = defineProps<{
  selectedNote: Note | null
}>()

const { updateNote, addNote, deleteNote } = useNotesStore()
const { updatingNote, newNote, creatingNewNote, addingNewNote, selectedNote: selectedNoteStore } = storeToRefs(useNotesStore())

const updatedNote = ref<Note['text'] | undefined>('');
const formattedDate = (date: Date) => {
  return useDateFormat(date, 'DD/MM/YYYY').value;
};

watch(
  () => props.selectedNote,
  (newNote, oldNote) => {
    if (newNote?.id !== oldNote?.id) {
      updatedNote.value = newNote?.text
    };
  })

onMounted(() => {
  updatedNote.value = props.selectedNote?.text
})

const handleUpdateNote = async () => {
  if (props.selectedNote) await updateNote(updatedNote.value as string, props.selectedNote?.id);
}

const handleAddNewNote = async () => {
  if (newNote.value.length) await addNote(new Date())
}

const handleDeleteNote = async () => {
  if (props.selectedNote) await deleteNote()
}

const newNoteTextArea = useTemplateRef('newNoteTextArea')
watchEffect(() => {
  if (newNoteTextArea.value) {
    newNoteTextArea.value.focus()
  }
})
const handleCreateNewNote = () => {
  creatingNewNote.value = true
  selectedNoteStore.value = null
}
</script>

<template>
  <section class="p-5 grid grid-rows-[25px_1fr] gap-10">
    <header class="flex justify-between">
      <UButton
        label="Create note"
        :icon="'i-lucide-pencil-line'"
        :color="!selectedNote && !creatingNewNote ? 'success' : 'neutral'"
        :class="{ 'animate-pulse ': !selectedNote && !creatingNewNote }"
        :variant="!selectedNote && !creatingNewNote ? 'soft' : 'ghost'"
        size="sm"
        @click="handleCreateNewNote"
      />
      <UButton
        v-if="selectedNote"
        label=""
        :icon="'i-lucide-trash'"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="handleDeleteNote"
      />
    </header>

    <main
      v-if="selectedNote"
      class="mt-10 mx-auto w-full text-center grid grid-rows-[auto_1fr] gap-5"
    >
      <small
        class="text-zinc-500 text-left w-full max-w-3xl mx-auto font-semibold"
      >
        Created: {{ formattedDate(selectedNote.createdAt as Date) }} / Updated:
        {{ formattedDate(selectedNote.updatedAt as Date) }}
      </small>
      <textarea
        v-model="updatedNote"
        class="text-zinc-400 w-full max-w-3xl mx-auto h-full !border-none !bg-transparent focus:outline-0 resize-none"
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

    <main
      v-else-if="creatingNewNote"
      class="mt-10 mx-auto w-full text-center grid grid-rows-[auto_1fr] gap-5"
    >
      <textarea
        ref="newNoteTextArea"
        v-model="newNote"
        class="text-zinc-400 w-full max-w-3xl mx-auto h-full !border-none !bg-transparent focus:outline-0 resize-none"
        placeholder="Start typing..."
      />

      <UButton
        v-if="newNote.length"
        label="Save new note"
        class="w-fit place-self-end"
        color="success"
        size="lg"
        :loading="addingNewNote"
        @click="handleAddNewNote"
      />
    </main>

    <main
      v-else
      class="mt-10 mx-auto w-full text-center grid grid-rows-[auto_1fr] gap-5"
    >
      <p class="flex justify-center items-center gap-4">
        <span class="text-4xl">😱</span>
        Wow ... So empty! Click "Create note" to start creating your first note
      </p>
    </main>

  </section>
</template>