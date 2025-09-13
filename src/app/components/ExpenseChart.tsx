"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Expense {
  id: number;
  title: string;
  amount: number;
}

interface Props {
  expenses: Expense[];
  currencySymbol: string;
}

export default function ExpenseChart({ expenses, currencySymbol }: Props) {
  const data = {
    labels: expenses.map((e) => e.title),
    datasets: [
      {
        label: "Amount",
        data: expenses.map((e) => e.amount), // ✅ No conversion here
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let value = context.raw;
            return `${currencySymbol}${value.toFixed(2)}`; // ✅ Shows only entered amount
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
        },
      },
      y: {
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <div className="w-full p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-4">
        Expense Chart
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
