import { z } from 'zod'
// import { prisma } from '../../prisma/db'

const addNoteSchema = z.object({
  text: z
		.string()
		.trim()
		.min(1, { message: 'Text must not be empty' })
})

export default defineEventHandler(async (event) => {
  try {
    const { text } = await readValidatedBody(event, addNoteSchema.parse)

    console.log(text)

    // await prisma.note.create({
    //   data: {
    //     text,
    //   }
    // })

    return {
      ok: true,
      data: 'success'
    }
  } catch (error) {
    // if (error.code === "P2002") {
    //   throw createError({
    //     statusCode: 409, // code for duplicate
    //     message: 'An email with this address already exists',
    //   })
    // } else {
    throw new error
    // }
  }
})