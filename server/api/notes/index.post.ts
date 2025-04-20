import { z } from "zod";
import { prisma } from '../../../prisma/db'

const addNoteSchema = z.object({
  text: z.string().trim().min(1, { message: "Text must not be empty" }),
  userId: z.number(),
  createdAt: z.string()
});

export default defineEventHandler(async (event) => {
  try {
    const { text, userId, createdAt } = await readValidatedBody(
      event,
      addNoteSchema.parse
    );

    await prisma.note.create({
      data: {
        text,
        userId,
        createdAt,
      },
    });

    return {
      ok: true,
      data: "success",
    };
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
});
