"use client";

import React, { useEffect, useState } from "react";

interface Expense {
  id: number;
  title: string;
  amount: number;
  currency: string;
}

interface Props {
  onAdd: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  editingExpense: Expense | null;
  cancelEdit: () => void;
  currentCurrency: string; // currency selected in the page at time of adding
  currencySymbol: string;
}

export default function AddExpenseForm({
  onAdd,
  onEdit,
  editingExpense,
  cancelEdit,
  currentCurrency,
  currencySymbol,
}: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  // when editing -> prefill fields (note: amount saved is in expense.currency)
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
    } else {
      setTitle("");
      setAmount("");
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount === "") return;

    if (editingExpense) {
      // keep the original currency of the expense unless we want to let user change it
      onEdit({
        id: editingExpense.id,
        title: title.trim(),
        amount: Number(amount),
        currency: editingExpense.currency || currentCurrency,
      });
    } else {
      // For new expense: store the currency that is active now (currentCurrency)
      onAdd({
        id: Date.now(),
        title: title.trim(),
        amount: Number(amount),
        currency: currentCurrency,
      });
    }

    setTitle("");
    setAmount("");
  };

  // displaySymbol: if editing, show the expense's currency; otherwise show currentCurrency symbol
  const displaySymbol = editingExpense ? editingExpense.currency : currentCurrency;

  // small map for symbol display when editingExpense present - but we already have currencySymbol for current selection,
  // so if editingExpense currency differs we show just the code (this avoids passing the entire symbols map)
  const amountLabel =
    editingExpense && editingExpense.currency !== currentCurrency
      ? `${editingExpense.currency}`
      : `${currencySymbol}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl flex flex-col gap-4 text-white"
    >
      <h2 className="text-2xl font-bold drop-shadow-lg">
        {editingExpense ? "✏️ Edit Expense" : "➕ Add Expense"}
      </h2>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-white/80">Title</span>
        <input
          type="text"
          placeholder="e.g. Coffee with friends"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded-lg bg-white/10 placeholder-white/60 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-white/80">Amount ({amountLabel})</span>
        <input
          type="number"
          placeholder="e.g. 1000"
          value={amount === "" ? "" : amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="p-3 rounded-lg bg-white/10 placeholder-white/60 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg text-white shadow ${
            editingExpense
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-95"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-95"
          }`}
        >
          {editingExpense ? "Update" : "Add"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
