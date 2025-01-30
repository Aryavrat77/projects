import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'


export const userRouter = createTRPCRouter({

    userCreate: publicProcedure //endpoint
        .input(z.object({ name: z.string().nullable(), id: z.string().nullable()}))
        .mutation(async ({ input, ctx }) => {
            
            if (!input.id || !input.name) {
                return null;
            }
            // return null if id is already in db
            const existingUser = await ctx.db.user.findUnique({
                where: {
                    id: input.id
                }
            })
            if (existingUser) {
                return null;
            }

            const user = await ctx.db.user.create({
                data: {
                    id: input.id,
                    name: input.name
                },
            });
            return user
        }),

    updateName: publicProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const user = await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name
                }
            })
            return user
        }),

    userDelete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const user = await ctx.db.user.delete({
                where: {
                    id: input.id
                }
            })
            return user
        }),

    getUserById: publicProcedure
        .input(z.object({ id: z.string().nullable() }))
        .query(async ({ input, ctx }) => {
            if (!input.id) {
                return null;
              }
            const user = await ctx.db.user.findUnique({
                where: {
                    id: input.id
                }
            })
            return user
        }),
        
    getUserId: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ input, ctx }) => {
            const user = await ctx.db.user.findFirst({
                where: {
                    name: input.name
                },
                select: {
                    id: true
                }
            })
            return user
        }),

    getAllLabs: publicProcedure
        .input(z.object({ userId: z.string().nullable() }))
        .query(async ({ input, ctx }) => {
            if (!input.userId) {
                return null;
            }
            const labs = await ctx.db.lab.findMany({
                where: {
                    userId: input.userId
                }
            })
            return labs;
        }),
    getOneUserLabByName: publicProcedure
        .input(z.object({ userId: z.string().nullable(), name: z.string() }))
        .query(async ({ input, ctx }) => {
            if (!input.userId || !input.name) {
                return null;
            }
            const lab = await ctx.db.lab.findFirst({
                where: {
                    userId: input.userId,
                    name: input.name
                }
            })
            return lab;
        }),
    getLatestLab: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input, ctx }) => {
            const lab = await ctx.db.lab.findFirst({
                where: {
                    userId: input.userId
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            return lab;
        }),
})