import { defineStore } from 'pinia';
import type { Note } from '@/types/notes';

export const useNotesStore = defineStore('notesStore', () => {
  const selectedNote = ref<Note | null>(null)
  
  const allNotes = ref<Note[]>([])
  const fetchingAllNotes = ref<boolean>(true)

  const setSelectedNote = (note: Note) => {
    selectedNote.value = note
  }

  const fetchAllNotes = async () => {
    fetchingAllNotes.value = true
    try {
      const response = await $fetch('/api/notes')
      if (response?.ok) {
        allNotes.value = response?.data.map(note => ({
          ...note,
        }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      // Ensures we always reset the loading state, preventing UI from getting stuck
      fetchingAllNotes.value = false
    }
  }

  return {
    setSelectedNote,
    fetchAllNotes,
    fetchingAllNotes,
    selectedNote,
    allNotes
  }
})