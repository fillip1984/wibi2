import { Frequency } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaEllipsisVertical, FaTrash } from "react-icons/fa6";
import { api } from "~/trpc/react";
import { BudgetCategoryAndEntries } from "~/trpc/types";
import MenuDropdown from "./shared/MenuDropdown";

export default function EditBudgetCategoryModal({
  budgetCategory,
}: {
  budgetCategory: BudgetCategoryAndEntries;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    setName(budgetCategory.name);
    setDescription(budgetCategory.description);
    setAmount(
      budgetCategory.entries.reduce(
        (acc, entry) => (acc += parseInt(entry.amount.toString())),
        0,
      ),
    );
  }, [budgetCategory]);

  const [entry, setEntry] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryFrequency, setEntryFrequency] = useState("");
  const utils = api.useUtils();
  const { mutate: addBudgetEntry } = api.budgetEntry.create.useMutation({
    onSuccess: async () => {
      await utils.budgetEntry.readAll.invalidate();
      await utils.budgetCategory.readAll.invalidate();
      setEntry("");
      setEntryAmount("");
      setEntryFrequency("");
    },
  });
  const handleAddEntry = () => {
    addBudgetEntry({
      name: entry,
      amount: parseInt(entryAmount),
      frequency: entryFrequency as Frequency,
      budgetCategoryId: budgetCategory.id,
    });
  };

  const { mutate: deleteBudgetCategory } =
    api.budgetCategory.delete.useMutation({
      onSuccess: async () => {
        await utils.budgetCategory.readAll.invalidate();
      },
    });
  const handleDelete = (id: string) => {
    deleteBudgetCategory({ id });
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between">
        <h5>Budget Category</h5>
        <MenuDropdown
          button={
            <button className="rounded-full p-1 hover:bg-slate-600">
              <FaEllipsisVertical />
            </button>
          }
          content={
            <div>
              <button
                onClick={() => handleDelete(budgetCategory.id)}
                className="flex w-full items-center justify-between gap-2 p-2 hover:rounded hover:bg-red-400/30 hover:text-red-400">
                Delete
                <FaTrash className="text-red-400" />
              </button>
            </div>
          }
        />
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setName(e.target.value)}></textarea>
      <span>${amount}</span>

      <h5>Entries</h5>
      {budgetCategory.entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between">
          <div className="flex flex-col">
            <span>{entry.name}</span>
            <span className="text-xs text-gray-400">{entry.frequency}</span>
          </div>
          <span>${entry.amount.toString()}</span>
        </div>
      ))}
      <input
        type="text"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Entry name..."
      />
      <div className="flex gap-2">
        <input
          type="number"
          value={entryAmount}
          onChange={(e) => setEntryAmount(e.target.value)}
          placeholder="Entry amount..."
        />
        <select
          value={entryFrequency}
          onChange={(e) => setEntryFrequency(e.target.value)}>
          <option value="">How often?</option>
          <option value="WEEKLY">Weekly</option>
          <option value="BIWEEKLY">Biweekly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="BIMONTHLY">Bimonthly</option>
          <option value="QUARTERLY">Quarterly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>
      <button
        onClick={handleAddEntry}
        className="rounded bg-emerald-600 px-4 py-2">
        Add
      </button>
    </div>
  );
}
