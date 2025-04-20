import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const note = await prisma.note.delete({
      where: {
        id: Number(id),
      },
    })

    return {
      ok: true,
      data: note
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