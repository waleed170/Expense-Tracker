"use client";

import React from "react";

interface Expense {
  id: number;
  title: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  onDelete: (id: number) => void;
  onEditClick: (expense: Expense) => void;
  currencySymbol: string;
}

export default function ExpenseList({
  expenses,
  onDelete,
  onEditClick,
  currencySymbol,
}: Props) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="w-full p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl text-center text-white">
        <p className="text-white/80">No expenses yet — add your first one.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-4">
        Expense History
      </h2>

      <ul className="flex flex-col gap-3">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <div className="flex flex-col">
              <span className="text-white font-medium">{expense.title}</span>
              <span className="text-sm text-white/70">
                {currencySymbol}
                {expense.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditClick(expense)}
                className="px-3 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-95 shadow"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this expense?")) onDelete(expense.id);
                }}
                className="px-3 py-1 rounded-md bg-gradient-to-r from-red-500 to-rose-500 text-white hover:opacity-95 shadow"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
