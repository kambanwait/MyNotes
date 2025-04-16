import { z } from 'zod'
import { prisma } from '../../prisma/db'

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readValidatedBody(event, registrationSchema.parse)
    const hashedPassword = await hashPassword(password)

    // await new Promise(resolve => setTimeout(resolve, 3000))

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    })

    return {
      ok: true,
      data: 'success'
    }
  } catch (error) {
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409, // code for duplicate
        message: 'An email with this address already exists',
      })
    } else {
      throw error
    }
  }
})