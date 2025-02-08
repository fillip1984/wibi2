"use client";

import { type BudgetEntryType } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaFileInvoice, FaMoneyCheck, FaUpLong } from "react-icons/fa6";
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

  const { data: budgetEntries } = api.budgetEntry.readAll.useQuery();
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
        className="h-10">
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
            className={`flex flex-col items-center rounded-lg ${summary.type === "INCOME" ? "bg-emerald-500" : summary.type === "EXPENSE" ? "bg-red-500" : "bg-yellow-500"} `}>
            <h5 className="flex w-full items-center justify-between bg-gray-800/30 px-2 uppercase text-gray-300">
              {summary.name}
              {summary.icon}
            </h5>
            <h2 className="my-2">${summary.amount}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}
