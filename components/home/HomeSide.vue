<script setup lang="ts">
import type { Note } from '~/types/notes.type';
import { useTimeAgo } from '@vueuse/core'

const { clear, loggedIn, user } = useUserSession()

defineProps<{
  fetching: boolean,
  selectedNote: Note | null
}>()

const { setSelectedNote } = useNotesStore()
const { allNotes, todaysNotes, yesterdayNotes, earlierNotes } = storeToRefs(useNotesStore())

const formattedDate = (dateTime: Date) => useTimeAgo(dateTime)

// clear the user session & redirect user to login page
const handleLogout = async () => {
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <aside class="bg-black p-4 shadow-2xl shadow-zinc-900">
    <section
      v-if="user"
      class="grid gap-10 grid-rows-[70px_2fr] h-screen w-full overflow-hidden"
    >
      <header class="flex flex-wrap justify-between items-center">
        <TheLogo />

        <UButton
          v-if="loggedIn"
          size="sm"
          variant="outline"
          @click="handleLogout"
        >
          Logout
        </UButton>
        <NuxtLink
          v-else
          to="/login"
        >Login</NuxtLink>
        <small class="w-full">{{ user.name }}</small>

      </header>

      <main class="flex flex-col overflow-y-scroll">

        <template v-if="fetching">
          <USkeleton class="h-5 w-full mb-2.5" />
          <USkeleton class="h-22 w-full my-2.5" />
          <USkeleton class="h-22 w-full my-2.5" />
          <USkeleton class="h-22 w-full my-2.5" />
        </template>

        <template v-else>

          <template v-if="todaysNotes?.length">
            <p class="text-xs font-bold text-zinc-500 my-4">Today</p>
            <ol class="flex flex-col gap-2">
              <li
                v-for="note in todaysNotes"
                :key="note.id"
                class="hover:cursor-pointer hover:border-amber-300 hover:border border border-transparent transition-colors text-zinc-200 rounded-xl p-4"
                :class="{ 'bg-amber-500 border text-zinc-800' : selectedNote?.id === note.id }"
                @click="setSelectedNote(note)"
              >
                <header class="flex justify-between mb-0.5 gap-0.5">
                  <h4 class="font-bold truncate">{{ note.text.substring(0, 50) }}</h4>
                </header>
                <main>
                  <p>
                    {{ note.text.substring(30, 80) }}...
                  </p>
                  <small class="opacity-80 font-semibold">{{ formattedDate(note.updatedAt as Date) }}</small>
                </main>
              </li>
            </ol>
          </template>

          <template v-if="yesterdayNotes?.length">
            <p class="text-xs font-bold text-zinc-500 my-4">Yesterday</p>
            <ol class="flex flex-col gap-2">
              <li
                v-for="note in yesterdayNotes"
                :key="note.id"
                class="hover:cursor-pointer hover:border-amber-300 hover:border border border-transparent transition-colors text-zinc-200 rounded-xl p-4"
                :class="{ 'bg-amber-500 border text-zinc-800' : selectedNote?.id === note.id }"
                @click="setSelectedNote(note)"
              >
                <header class="flex justify-between mb-0.5 gap-0.5">
                  <h4 class="font-bold truncate">{{ note.text.substring(0, 50) }}</h4>
                </header>
                <main>
                  <p>
                    {{ note.text.substring(30, 80) }}...
                  </p>
                  <small class="opacity-80 font-semibold">{{ formattedDate(note.updatedAt as Date) }}</small>
                </main>
              </li>
            </ol>
          </template>

          <template v-if="earlierNotes?.length">
            <p class="text-xs font-bold text-zinc-500 my-4">Eearlier notes</p>
            <ol class="flex flex-col gap-2">
              <li
                v-for="note in earlierNotes"
                :key="note.id"
                class="hover:cursor-pointer hover:border-amber-300 hover:border border border-transparent transition-colors text-zinc-200 rounded-xl p-4"
                :class="{ 'bg-amber-500 border text-zinc-800' : selectedNote?.id === note.id }"
                @click="setSelectedNote(note)"
              >
                <header class="flex justify-between mb-0.5 gap-0.5">
                  <h4 class="font-bold truncate">{{ note.text.substring(0, 50) }}</h4>
                </header>
                <main>
                  <p>
                    {{ note.text.substring(30, 80) }}...
                  </p>
                  <small class="opacity-80 font-semibold">{{ formattedDate(note.updatedAt as Date) }}</small>
                </main>
              </li>
            </ol>
          </template>

          <template v-if="!allNotes.length">
            <small>No notes yet. Click "Create note" to start...</small>
          </template>

        </template>
      </main>

    </section>
  </aside>
</template>