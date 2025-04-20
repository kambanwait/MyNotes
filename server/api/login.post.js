import { z } from 'zod'
import { prisma } from '../../prisma/db'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  // Find the user in the database using Prisma
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  // throw an error if user is null
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'User not found, please check your email and try again.'
    })
  }
  
  // verify the password using authUtils
  const verifiedPassword = await verifyPassword(user.password, password)
  // throw an error when password doesn't match
  if (!verifiedPassword) {
    throw createError({
      statusCode: 401,
      message: 'Please check your password and try again.'
    })
  }

  // if we have a valid user and password, create a user session using authUtils
  if (verifiedPassword && user) {
    // create user session in cookie
    await setUserSession(event, {
      // user data
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      // Any extra fields for the session data
      loggedInAt: new Date()
    })

    return await getUserSession(event);
  }
})