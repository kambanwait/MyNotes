import { prisma } from '../../../prisma/db'

export default defineEventHandler(async (event) => {
  
  try {
    const { user } = await getUserSession(event)
    const body = await readBody(event)
    const noteId = getRouterParam(event, 'id')
    
    if (user?.id !== body.userId) throw createError({
        statusCode: 403, // Forbidden - user doesn't have permission to update this note
        message: 'You do not have permission to update this note',
    })

    const note = await prisma.note.update({
      where: {
        id: Number(noteId),
        userId: user?.id,
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
})