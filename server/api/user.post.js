import { z } from 'zod'
import { prisma } from '../../prisma/db'

const registrationSchema = z.object({
  name: z
		.string()
		.trim()
		.min(3, { message: 'Name must be at least 3 characters long' })
		.refine(
			(val) => val.split(' ').filter(Boolean).length >= 2,
			{ message: 'Please enter your full name' }
		),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export default defineEventHandler(async (event) => {
  try {
    const { name, email, password } = await readValidatedBody(event, registrationSchema.parse)
    const hashedPassword = await hashPassword(password)

    await prisma.user.create({
      data: {
        name,
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