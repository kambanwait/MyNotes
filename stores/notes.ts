import type { Note } from '~/types/notes.type';

import { defineStore } from 'pinia';

export const useNotesStore = defineStore('notesStore', () => {
  const toast = useToast()
  const { user } = useUserSession()
  
  const selectedNote = ref<Note | null>(null)
  
  const allNotes = ref<Note[]>([])
  const fetchingAllNotes = ref<boolean>(true)

  const setSelectedNote = (note: Note) => {
    selectedNote.value = note
  }

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

  const fetchAllUserNotes = async () => {
    fetchingAllNotes.value = true
    const userId = user.value?.id

    try {
      const response = await $fetch<{ ok: boolean; data: Note[] }>(`/api/notes/${userId}`);

      if (response.ok) {
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

  const updatingNote = ref<boolean>(false);
  const updateNote = async (updatedNote: Note['text'], noteId: Note['id']) => {
    updatingNote.value = true;

    try { 
      const response = await $fetch<{ ok: boolean; data: Note[] }>(`/api/notes/${noteId}`, {
        method: 'PATCH',
        body: {
          updatedNote,
        }
      })

      if (response?.ok) {
        fetchAllUserNotes()
        setSelectedNote(response.data[0])
        toast.add({
          title: 'Updated note',
          description: "Note was updated",
          color: 'success',
          duration: 1000,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      updatingNote.value = false;
    }
  }

  const addingNewNote = ref<boolean>(false)
  const addNote = async (createdAt: Date) => {
    try {
      addingNewNote.value = true

      const response = await $fetch<{ ok: boolean; data: Note[] }>('/api/notes', {
        method: 'POST',
        body: {
          text: newNote.value,
          userId: user.value?.id,
          createdAt: createdAt,
        }
      })

      if (response.ok) {
        toast.add({
          title: 'Created note',
          description: "Note was created",
          color: 'success',
          duration: 1000,
        })
        setSelectedNote(response?.data[0])
        fetchAllUserNotes()
        creatingNewNote.value = false
        newNote.value = ''
      }

    } catch (error) {
      console.error(error)
    } finally {
      addingNewNote.value = false
    }
  }

  const creatingNewNote = ref<boolean>(false)
  const newNote = ref<Note['text']>('')

  const deletingNote = ref<boolean>(false)
  const deleteNote = async () => {
    try {
      deletingNote.value = true

      if (user.value?.id !== selectedNote.value?.userId) {
        toast.add({
          title: "Note doesn't belong to this user!",
          description: "Something's gone wrong here 🫣",
          color: 'error',
          duration: 5000,
        })
      }

      const response = await $fetch<{ ok: boolean; data: Note[] }>(`/api/notes/${selectedNote.value?.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.add({
          title: 'Note deleted',
          description: "Note was deleted successfully",
          color: 'success',
          duration: 1000,
        })
        selectedNote.value = null
        fetchAllUserNotes()
      }
      
    } catch (error) {
      console.error(error)
    } finally {
      deletingNote.value = false
    }
  }

  return {
    setSelectedNote,
    fetchAllUserNotes,
    addNote,
    updateNote,
    deleteNote,
    fetchingAllNotes,
    updatingNote,
    addingNewNote,
    selectedNote,
    newNote,
    creatingNewNote,
    deletingNote,
    allNotes,
    todaysNotes,
    yesterdayNotes,
    earlierNotes
  }
})