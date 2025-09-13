"use client";

interface CurrencySelectorProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export default function CurrencySelector({ currency, setCurrency }: CurrencySelectorProps) {
  return (
    <div className="p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl flex items-center gap-3">
      <label htmlFor="currency" className="text-white font-semibold">
        Currency:
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="p-2 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="USD">USD $</option>
        <option value="EUR">EUR €</option>
        <option value="GBP">GBP £</option>
        <option value="JPY">JPY ¥</option>
        <option value="INR">INR ₹</option>
        <option value="PKR">PKR ₨</option>
      </select>
    </div>
  );
}
