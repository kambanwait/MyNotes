import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event) => {
  
  try {
    const body = await readBody(event)
    const noteId = getRouterParam(event, 'id')

    const note = await prisma.note.update({
      where: {
        id: Number(noteId),
      },
      data: {
        text: body.updatedNote,
      }
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

  return `User profile!`
})