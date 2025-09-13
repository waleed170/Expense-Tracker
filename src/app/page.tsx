"use client";

import { useState, useEffect } from "react";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";
import CurrencySelector from "./components/CurrencySelector";
import ParticlesBackground from "./components/ParticlesBackground";

interface Expense {
  id: number;
  title: string;
  amount: number; // amount as entered (in expense.currency)
  currency: string; // currency code at time of creation (e.g., "PKR")
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [currency, setCurrency] = useState("USD");

  // Static exchange rates (units per 1 USD)
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.91,
    GBP: 0.78,
    JPY: 142.5,
    INR: 83.2,
    PKR: 278.0,
  };

  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    PKR: "₨",
  };

  // Load expenses from localStorage; support legacy items without currency by assuming USD
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    const savedCurrency = localStorage.getItem("currency");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as any[];
        const normalized = parsed.map((e) => ({
          id: e.id,
          title: e.title,
          amount: Number(e.amount),
          currency: e.currency ?? "USD",
        })) as Expense[];
        setExpenses(normalized);
      } catch {
        // ignore parse errors
      }
    }
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  // Persist expenses and selected currency
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  // Add: AddExpenseForm will pass an expense with currency set to current currency
  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const startEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  // Update an existing expense (keep currency if editingExpense had it)
  const editExpense = (updated: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditingExpense(null);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
  };

  // Convert an amount from `fromCurrency` to the currently selected `currency`
  const convertAmount = (amount: number, fromCurrency: string) => {
    const fromRate = rates[fromCurrency] ?? 1;
    const toRate = rates[currency] ?? 1;
    // amount_in_usd = amount / fromRate
    // amount_in_target = amount_in_usd * toRate
    return (amount / fromRate) * toRate;
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center p-8 gap-8 bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 overflow-hidden">
      {/* particle layer */}
      <ParticlesBackground />

      <h1 className="relative text-4xl font-extrabold text-white drop-shadow-lg z-10">
        💎 Luxury Expense Tracker
      </h1>

      <div className="relative z-10">
        <CurrencySelector currency={currency} setCurrency={setCurrency} />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-8 w-full max-w-6xl z-10">
        <AddExpenseForm
          onAdd={(e) =>
            addExpense({
              ...e,
              // ensure currency set when creating
              currency: e.currency ?? currency,
            })
          }
          onEdit={editExpense}
          editingExpense={editingExpense}
          cancelEdit={cancelEdit}
          currentCurrency={currency}
          currencySymbol={symbols[currency]}
        />

        <ExpenseChart
          expenses={expenses}
          convertAmount={convertAmount}
          currencySymbol={symbols[currency]}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          onEditClick={startEditExpense}
          convertAmount={convertAmount}
          currencySymbol={symbols[currency]}
        />
      </div>
    </main>
  );
}
