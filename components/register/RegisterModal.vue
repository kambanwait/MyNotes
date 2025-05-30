<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .refine(
      (val) => val.split(' ').filter(Boolean).length >= 2,
      { message: 'Please enter your full name' }
    ),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const { user } = useUserSession()
onMounted(() => {
  // If there's already a session in the browser, then re-direct the user to their homepage
  if (user.value) navigateTo({ name: 'home' })
})

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
})

const toast = useToast()
const isRegistering = ref<boolean>(false)

onMounted(() => {
  state.email = ''
  state.password = ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isRegistering.value = true
  const { name, email, password } = event.data

  try {
    const response = await $fetch('/api/user', {
      method: 'POST',
      body: {
        name,
        email,
        password,
      }
    })

    if (response.ok) {
      toast.add({
        title: 'Registered account',
        description: 'Your account has been created',
        color: 'success',
        duration: 0,
        actions: [{
          icon: 'i-lucide-arrow-right',
          label: 'Login',
          color: 'success',
          onClick: (event) => {
            event?.stopPropagation()
            navigateTo({ path: '/' })
          }
        }]
      })
    } else {
      throw error
    }
  } catch (error) {
    // Check for Zod error message or another type of error message
    const errorMessage = error.response?._data?.data?.issues
      ? error.response?._data?.data?.issues[0].message
      : error?.response?._data.message

    toast.add({
      title: 'Error creating account',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isRegistering.value = false
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
        Sign up for a free account
      </h3>

      <p class="text-sm text-zinc-300">
        Already registered? <NuxtLink
          to="/login"
          class="underline text-amber-500"
        >Log in</NuxtLink> to your account
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
          label="Full name"
          name="fullName"
          class="space-y-2"
          required
        >
          <UInput
            v-model="state.name"
            placeholder="John Doe"
            class="w-full"
            autocomplete="name"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
          class="space-y-2"
          help="We won't share your email."
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
          help="Minimum of 8 characters"
          required
        >
          <UInput
            v-model="state.password"
            class="w-full"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            autocomplete="new-password"
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
          :loading="isRegistering"
          :disabled="isRegistering"
          variant="outline"
        >
          Register
        </UButton>
      </UForm>
    </main>
  </section>
</template>