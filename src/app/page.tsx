"use client";

import { type BudgetCategoryType } from "@prisma/client";
import { format } from "date-fns";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { FaFileInvoice, FaMoneyCheck, FaPlus, FaUpLong } from "react-icons/fa6";
import { api } from "~/trpc/react";
import { BudgetCategoryAndEntries, BudgetSummaryType } from "~/trpc/types";
import EditBudgetCategoryModal from "./_components/EditBudgetCategoryModal";
import Modal from "./_components/shared/Modal";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "MMMM"),
  );

  const { data: budgetCategories } = api.budgetCategory.readAll.useQuery();
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummaryType[]>();
  useEffect(() => {
    const incomeCategories = budgetCategories?.filter(
      (entry) => entry.type === "INCOME",
    );
    const expenseCategories = budgetCategories?.filter(
      (entry) => entry.type === "EXPENSE",
    );

    const incomeSummary: BudgetSummaryType = {
      amount:
        incomeCategories?.reduce(
          (total, category) =>
            (total += category.entries.reduce(
              (acc, entry) => (acc += parseInt(entry.amount.toString())),
              0,
            )),
          0,
        ) ?? 0,
      type: "INCOME",
      icon: <FaMoneyCheck />,
    };
    const expenseSummary: BudgetSummaryType = {
      amount:
        expenseCategories?.reduce(
          (total, category) =>
            (total += category.entries.reduce(
              (acc, entry) => (acc += parseInt(entry.amount.toString())),
              0,
            )),
          0,
        ) ?? 0,
      icon: <FaFileInvoice />,
      type: "EXPENSE",
    };
    const surplusSummary: BudgetSummaryType = {
      amount: incomeSummary.amount - expenseSummary.amount,
      icon: <FaUpLong />,
      type: "SURPLUS",
    };
    setBudgetSummary([incomeSummary, expenseSummary, surplusSummary]);
  }, [budgetCategories]);

  return (
    <div className="container mx-auto mt-2 flex max-w-[600px] flex-col gap-4">
      <Heading
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        budgetSummary={budgetSummary}
      />
      <BudgetCategoriesView budgetCategories={budgetCategories} />
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

  const handleImport = () => {
    console.log("importing...");
  };

  const handleExport = () => {
    console.log("exporting...");
  };

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="grid grid-cols-3 justify-center gap-2">
        {budgetSummary?.map((summary) => (
          <button
            key={summary.type}
            type="button"
            className={`flex flex-col items-center rounded-lg ${summary.type === "INCOME" ? "bg-emerald-500" : summary.type === "EXPENSE" ? "bg-red-500" : "bg-yellow-500"} `}>
            <h5 className="flex w-full items-center justify-between px-2 uppercase text-black">
              {summary.type}
              {summary.icon}
            </h5>
            <p className={`my-2 text-3xl sm:text-4xl`}>${summary.amount}</p>
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
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
        <button
          onClick={handleImport}
          className="rounded border border-yellow-500 px-4 py-2 text-yellow-500">
          Import
        </button>
        <button
          onClick={handleExport}
          className="rounded border border-yellow-500 px-4 py-2 text-yellow-500">
          Export
        </button>
      </div>
    </div>
  );
};

const BudgetCategoriesView = ({
  budgetCategories,
}: {
  budgetCategories: BudgetCategoryAndEntries[] | undefined;
}) => {
  const utils = api.useUtils();

  const [isAddBudgetCategoryVisible, setIsAddBudgetCategoryVisible] =
    useState(false);
  const { mutate: addBudgetCategory } = api.budgetCategory.create.useMutation({
    onSuccess: async () => {
      await utils.budgetCategory.readAll.invalidate();
    },
  });
  const handleLoadDefaults = () => {
    // See: https://www.ramseysolutions.com/budgeting/easily-forgotten-monthly-expenses
    addBudgetCategory({
      name: "Income",
      description: "Paycheck, side hustles, etc.",
      type: "INCOME",
    });
    addBudgetCategory({
      name: "Food",
      description: "Groceries but exclude restaurants",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Health and Fitness",
      description: "Gym and medical expenses",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Housing",
      description: "Rent or mortgage",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Insurance",
      description: "Car, health, home, life insurance",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Lifestyle and Entertainment",
      description:
        "Dining out, movies, concerts, hobbies, streaming services, subscriptions, travel",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Personal",
      description: "Clothing, haircuts, personal care, pocket change",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Pets",
      description: "Food, vet, grooming",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Transportation",
      description: "Gas, public transportation, car maintenance, car payment",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Utilities",
      description: "Gas, electric, water, internet, phone, trash",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Giving",
      description: "Donations",
      type: "EXPENSE",
    });
    addBudgetCategory({
      name: "Savings",
      description: "Emergency fund, retirement, and large purchases",
      type: "EXPENSE",
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        {budgetCategories?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            There are no budget categories...{" "}
            <button
              type="button"
              onClick={handleLoadDefaults}
              className="rounded bg-emerald-500 px-4 py-2">
              Load defaults?
            </button>
          </div>
        )}
        {budgetCategories?.map((category) => (
          <BudgetCategoryRow key={category.id} category={category} />
        ))}

        {isAddBudgetCategoryVisible ? (
          <AddBudgetCategory
            dismiss={() => setIsAddBudgetCategoryVisible(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsAddBudgetCategoryVisible(true)}
            className="flex items-center gap-2">
            <FaPlus className="text-emerald-400" />
            Add Budget Category
          </button>
        )}
      </div>
    </>
  );
};

const BudgetCategoryRow = ({
  category,
}: {
  category: BudgetCategoryAndEntries;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        key={category.id}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between rounded bg-stone-700 p-1">
        <div className="flex flex-col items-start">
          <span>{category.name}</span>
          <span className="text-left text-xs text-gray-400">
            {category.description}
          </span>
        </div>
        <h4
          className={`${category.type === "INCOME" ? "text-green-400" : "text-red-400"}`}>
          $
          {category.entries.reduce(
            (acc, entry) => (acc += parseInt(entry.amount.toString())),
            0,
          )}
        </h4>
        {/* <button type="button" onClick={() => handleDelete(category.id)}>
            <FaTrash />
          </button> */}
      </button>

      <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
        <EditBudgetCategoryModal budgetCategory={category} />
      </Modal>
    </>
  );
};

const AddBudgetCategory = ({ dismiss }: { dismiss: () => void }) => {
  const utils = api.useUtils();
  const { mutate: addBudgetCategory } = api.budgetCategory.create.useMutation({
    onSuccess: async () => {
      await utils.budgetCategory.readAll.invalidate();
      setName("");
      setDescription("");
      setType("EXPENSE");
    },
  });
  const handleAdd = () => {
    addBudgetCategory({ name, description, type });
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<BudgetCategoryType>("EXPENSE");

  return (
    <div className="m-2 flex flex-col gap-2 bg-stone-700 p-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New budget category..."
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description..."></textarea>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as BudgetCategoryType)}>
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
      </select>
      <button onClick={handleAdd} className="rounded bg-emerald-500 p-2">
        Add
      </button>
      <button type="button" onClick={dismiss} className="rounded border p-2">
        Cancel
      </button>
    </div>
  );
};
