"use client";

import { type BudgetEntry, type BudgetEntryType } from "@prisma/client";
import { format } from "date-fns";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import {
  FaCalendar,
  FaFileInvoice,
  FaMoneyCheck,
  FaUpLong,
} from "react-icons/fa6";
import { api } from "~/trpc/react";

export type BudgetSummaryType = {
  name: string;
  amount: number;
  entryCount: number;
  icon: React.ReactNode;
  type: BudgetEntryType | "SURPLUS";
};

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM"),
  );

  const { data: budgetEntries } = api.budgetEntry.readAll.useQuery();
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummaryType[]>();
  useEffect(() => {
    const incomeEntries = budgetEntries?.filter(
      (entry) => entry.type === "INCOME",
    );
    const expenseEntries = budgetEntries?.filter(
      (entry) => entry.type === "EXPENSE",
    );

    const incomeSummary: BudgetSummaryType = {
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
    const expenseSummary: BudgetSummaryType = {
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
    const surplusSummary: BudgetSummaryType = {
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
      <Heading
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        budgetSummary={budgetSummary}
      />
      <Details />
    </div>
  );
}

const Heading = ({
  selectedMonth,
  setSelectedMonth,
  budgetSummary,
}: {
  selectedMonth: string;
  setSelectedMonth: Dispatch<SetStateAction<string>>;
  budgetSummary: BudgetSummaryType[] | undefined;
}) => {
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

  return (
    <>
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
            <h5 className="flex w-full items-center justify-between bg-gray-800/30 px-2 text-gray-300 uppercase">
              {summary.name}
              {summary.icon}
            </h5>
            <h2 className="my-2">${summary.amount}</h2>
          </button>
        ))}
      </div>
    </>
  );
};

const Details = () => {
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([
    {
      id: "sadf",
      name: "KFB Paycheck",
      amount: 3100.0,
      frequency: "BIWEEKLY",
      type: "INCOME",
    },
  ]);

  return (
    <div className="flex flex-col">
      {budgetEntries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={`flex flex-col rounded-lg bg-emerald-500`}>
          {/* leading */}
          <h5 className="w-full bg-gray-800/30">{entry.type}</h5>
          <div className="flex w-full items-start justify-between p-2">
            <div className="flex flex-col items-start">
              <h5>{entry.name}</h5>
              <h4>${entry.amount}</h4>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar />
              {entry.frequency}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
