import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const organizationRouter = createTRPCRouter({
    createOrganization: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // Create a new organization
            const organization = await ctx.db.organization.create({
                data: {
                    name: input.name
                },
            });
            return organization;
        }),

    updateOrganization: publicProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // Update an organization's name
            const organization = await ctx.db.organization.update({
                where: { id: input.id },
                data: { name: input.name },
            });
            return organization;
        }),

    deleteOrganization: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // Delete an organization
            const organization = await ctx.db.organization.delete({
                where: { id: input.id },
            });
            return organization;
        }),

    getOrganizationById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            // Fetch a single organization by ID
            const organization = await ctx.db.organization.findUnique({
                where: { id: input.id },
                include: { users: true, labs: true }, // Optionally include related users and labs
            });
            return organization;
        }),

    getAllOrganizations: publicProcedure.query(async ({ ctx }) => {
        // Fetch all organizations
        const organizations = await ctx.db.organization.findMany({
            include: { users: true, labs: true }, // Optionally include related users and labs
        });
        return organizations;
    }),
});
