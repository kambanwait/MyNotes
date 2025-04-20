<script setup lang="ts">
definePageMeta({
  name: 'home',
  middleware: ['auth'],
})

const { user, clear: clearSession } = useUserSession()

const logout = async () => {
  await clearSession()
  navigateTo('/login')
}

</script>

<template>  
  <main v-if="user">
    <h1>Welcome {{ user.name }}</h1>
    <UButton @click="logout">Logout</UButton>
    <p>index</p>
  </main>
  <main v-else>
    <NuxtLink to="/login">
      Log in
    </NuxtLink>
  </main>
    </template>
</template>