import { type BudgetCategoryType } from "@prisma/client";
import { type RouterOutputs } from "~/trpc/react";

export type BudgetSummaryType = {
  type: BudgetCategoryType | "SURPLUS";
  amount: number;
  icon: React.ReactNode;
};

export type BudgetCategoryAndEntries =
  RouterOutputs["budgetCategory"]["readAll"][number];
