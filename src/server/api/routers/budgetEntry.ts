import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { BudgetEntryType, Frequency } from "@prisma/client";

export const budgetEntry = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.number(),
        frequency: z.nativeEnum(Frequency),
        type: z.nativeEnum(BudgetEntryType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.budgetEntry.create({
        data: input,
      });
    }),
  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.budgetEntry.findMany();
  }),
  read: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.budgetEntry.findUnique({
        where: { id: input.id },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        amount: z.number().optional(),
        frequency: z.nativeEnum(Frequency),
        type: z.nativeEnum(BudgetEntryType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.budgetEntry.update({
        where: { id: input.id },
        data: input,
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.budgetEntry.delete({
        where: { id: input.id },
      });
    }),
});
