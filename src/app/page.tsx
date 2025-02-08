"use client";

import { BudgetEntryType } from "@prisma/client";
import { eachMonthOfInterval, format } from "date-fns";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaFileInvoice,
  FaMoneyCheck,
  FaPiggyBank,
  FaUpLong,
} from "react-icons/fa6";
import { api } from "~/trpc/react";

type BudgetEntrySummary = {
  name: string;
  amount: number;
  entryCount: number;
  icon: React.ReactNode;
  type: BudgetEntryType | "SURPLUS";
};

export default function Home() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM"),
  );

  const utils = api.useUtils();
  const { data: budgetEntries } = api.budgetEntry.readAll.useQuery();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expsenseTotal, setExpenseTotal] = useState(0);
  const [budgetSummary, setBudgetSummary] = useState<BudgetEntrySummary[]>();
  useEffect(() => {
    const incomeEntries = budgetEntries?.filter(
      (entry) => entry.type === "INCOME",
    );
    const expenseEntries = budgetEntries?.filter(
      (entry) => entry.type === "EXPENSE",
    );

    const incomeSummary: BudgetEntrySummary = {
      name: "Income",
      amount:
        incomeEntries?.reduce(
          (acc, entry) => (acc += parseInt(entry.amount.toString())),
          0,
        ) ?? 0,
      entryCount: incomeEntries?.length ?? 0,
      icon: <FaMoneyCheck />,
      type: "INCOME",
    };
    const expenseSummary: BudgetEntrySummary = {
      name: "Expense",
      amount:
        expenseEntries?.reduce(
          (acc, entry) => (acc += parseInt(entry.amount.toString())),
          0,
        ) ?? 0,
      entryCount: expenseEntries?.length ?? 0,
      icon: <FaFileInvoice />,
      type: "EXPENSE",
    };
    const surplusSummary: BudgetEntrySummary = {
      name: "Surplus",
      amount: incomeSummary.amount - expenseSummary.amount,
      entryCount: 0,
      icon: <FaUpLong />,
      type: "SURPLUS",
    };
    setBudgetSummary([incomeSummary, expenseSummary, surplusSummary]);
  }, [budgetEntries]);

  return (
    <div className="container mx-auto mt-2 flex flex-col gap-4">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="h-10"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 justify-center gap-2 sm:grid-cols-3">
        {budgetSummary?.map((summary) => (
          <button
            key={summary.name}
            type="button"
            className={`flex min-w-[150px] flex-col rounded-lg ${summary.type === "INCOME" ? "bg-emerald-500" : summary.type === "EXPENSE" ? "bg-red-500" : "bg-yellow-500"} p-2`}
          >
            <h5 className="flex items-center justify-between uppercase text-gray-300">
              {summary.name} {summary.icon}
            </h5>
            <div className="flex flex-col items-center justify-between">
              <h3 className="my-2">${summary.amount}</h3>
              {summary.type !== "SURPLUS" && (
                <span className="rounded bg-gray-800/80 p-1 text-sm">
                  {summary.entryCount} entries
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
