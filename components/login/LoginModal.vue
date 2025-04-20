<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { user, fetch } = useUserSession()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const toast = useToast()
const isSubmitting = ref<boolean>(false)

onMounted(async () => {
  // If there's already a session in the browser, then re-direct the user to their homepage
  if (user.value) {
    await fetch()

    toast.add({
      title: 'Already logged in',
      description: "Redirecting to your notes...",
      color: 'info',
      duration: 1000,
    })
    navigateTo({ path: '/' })
  }
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isSubmitting.value = true

  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: {
        email: event.data.email,
        password: event.data.password,
      }
    })

    await fetch()

    toast.add({
      title: 'Logged in',
      description: "Redirecting to your notes...",
      color: 'success',
      duration: 1000,
    })
    navigateTo({ path: '/' })
  } catch (error) {
    // Check for Zod error message or another type of error message
    const errorMessage = error.response?._data?.data?.issues
      ? error.response?._data?.data?.issues[0].message
      : error?.response?._data.message

    toast.add({
      title: 'Error logging in to your account',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const showPassword = ref<boolean>(false)
</script>

<template>
  <section
    class="bg-black grid gap-5 w-sm md:w-md p-10 rounded-2xl shadow-xl shadow-zinc-900"
  >
    <header>
      <h2 class="text-white text-4xl mb-4">
        <span class="text-amber-500 font-semibold">M</span>y<span
          class="text-amber-500 font-semibold"
        >N</span>otes
      </h2>
      <h3 class="text-white text-xl">
        Log in to your account
      </h3>

      <p class="text-sm text-zinc-300">
        Don't have an account? <NuxtLink
          to="/register"
          class="underline text-amber-500"
        >Create</NuxtLink> one.
      </p>
    </header>

    <main class="flex flex-col">
      <UForm
        :schema
        :state
        class="mt-3 space-y-4 w-full"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
          class="space-y-2"
          required
        >
          <UInput
            v-model="state.email"
            placeholder="you@example.com"
            class="w-full"
            autocomplete="email"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          class="space-y-2"
          required
        >
          <UInput
            v-model="state.password"
            class="w-full"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            autocomplete="password"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <UButton
          icon="i-lucide-send"
          size="lg"
          type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          variant="outline"
        >
          Login
        </UButton>
      </UForm>
    </main>
  </section>
</template>