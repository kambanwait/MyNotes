import { prisma } from '../../prisma/db'

export default defineEventHandler(async () => {
  try {
    const notes = await prisma.note.findMany()
    return {
      ok: true,
      data: notes
    }
  } catch (error) {
    // if (error.code === "P2002") {
    //   throw createError({
    //     statusCode: 409, // code for duplicate
    //     message: 'An email with this address already exists',
    //   })
    // } else {
    console.log(error)
    // }
  }
})