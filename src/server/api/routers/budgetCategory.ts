import { BudgetCategoryType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const budgetCategory = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        type: z.nativeEnum(BudgetCategoryType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.budgetCategory.create({
        data: input,
      });
    }),
  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.budgetCategory.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }),
  read: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.budgetCategory.findUnique({
        where: { id: input.id },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.nativeEnum(BudgetCategoryType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.budgetCategory.update({
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
      return await ctx.db.budgetCategory.delete({
        where: { id: input.id },
      });
    }),
});
