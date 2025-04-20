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
  const todaysNotes: ComputedRef<Note[]> = computed(() => {
    return allNotes.value.filter((note: Note ) => {
      const noteDate = new Date(note.updatedAt)
      return noteDate.toDateString() === new Date().toDateString()
    })
  })
  
  const yesterdayNotes: ComputedRef<Note[]> = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    return allNotes.value.filter((note: Note ) => {
      const noteDate = new Date(note.updatedAt)
      return noteDate.toDateString() === yesterday.toDateString()
    })
  })

  const earlierNotes: ComputedRef<Note[]> = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    return allNotes.value.filter((note: Note ) => {
      const noteDate = new Date(note.updatedAt)
      return noteDate < yesterday && noteDate.toDateString() !== yesterday.toDateString()
    })
  })

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
    allNotes,
    todaysNotes,
    yesterdayNotes,
    earlierNotes
  }
})