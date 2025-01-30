import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const labRouter = createTRPCRouter({
    createLab: publicProcedure
        .input(z.object({ name: z.string(), userId: z.string().nullable(), id: z.string().nullable()}))
        .mutation(async ({ input, ctx }) => {
            if (!input.userId || !input.name || !input.id) {
                return null;
            }
            const existingLab = await ctx.db.lab.findUnique({
                where: {
                    id: input.id,
                    name: input.name,
                    userId: input.userId,
                }
            })
            if (existingLab) {
                return null;
            }
            const lab = await ctx.db.lab.create({
                data: {
                    id: input.id,
                    name: input.name,
                    progress: 1,
                    status: "active",
                    userId: input.userId
                },
            });
            return lab
    }),
    getLabById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const lab = await ctx.db.lab.findFirst({
                where: {
                    id: input.id
                }
            })
            return lab;
    }),
    markLabAsComplete: publicProcedure
        .input(z.object({ userId: z.string(), id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const lab = await ctx.db.lab.update({
                where: {
                    userId: input.userId,
                    id: input.id
                },
                data: {
                    status: "completed"
                }
            })
            return lab;
    }),
    updateLabProgress: publicProcedure
        .input(z.object({ userId: z.string(), id: z.string(), progress: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const lab = await ctx.db.lab.update({
                where: {
                    userId: input.userId,
                    id: input.id
                },
                data: {
                    progress: input.progress
                }
            })
            return lab;
    }),
    deleteLab: publicProcedure
        .input(z.object({ userId: z.string(), id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const lab = await ctx.db.lab.delete({
                where: {
                    userId: input.userId,
                    id: input.id
                }
            })
            return lab;
    })

});
