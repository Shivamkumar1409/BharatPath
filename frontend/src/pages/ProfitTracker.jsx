import { useState } from 'react';

export default function ProfitTracker() {
  const [records, setRecords] = useState([
    { id: 1, crop: 'Wheat', type: 'revenue', amount: 25000, date: '2026-03-01', note: 'Sold 10 quintal' },
    { id: 2, crop: 'Wheat', type: 'expense', amount: 5000, date: '2026-03-02', note: 'Fertilizer cost' },
    { id: 3, crop: 'Rice', type: 'revenue', amount: 18000, date: '2026-03-05', note: 'Sold 8 quintal' },
    { id: 4, crop: 'Rice', type: 'expense', amount: 3000, date: '2026-03-06', note: 'Irrigation cost' },
  ]);

  const [form, setForm] = useState({ crop: '', type: 'revenue', amount: '', note: '' });
  const [showForm, setShowForm] = useState(false);

  const totalRevenue = records.filter(r => r.type === 'revenue').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  const handleAdd = () => {
    if (!form.crop || !form.amount) return;
    setRecords([...records, {
      id: Date.now(),
      crop: form.crop,
      type: form.type,
      amount: parseFloat(form.amount),
      date: new Date().toISOString().split('T')[0],
      note: form.note,
    }]);
    setForm({ crop: '', type: 'revenue', amount: '', note: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">💰 Profit Tracker</h1>
          <p className="text-yellow-100">Track your farm income and expenses</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-gray-500 text-sm mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-500">₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className={`${netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-xl p-5`}>
            <p className="text-gray-500 text-sm mb-1">Net Profit</p>
            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ₹{netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">📋 Records</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition shadow-md"
          >
            {showForm ? '✕ Cancel' : '+ Add Record'}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-yellow-200">
            <h3 className="font-bold text-gray-700 mb-3">Add New Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Crop name (e.g. Wheat)"
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="revenue">💚 Revenue (Income)</option>
                <option value="expense">🔴 Expense (Cost)</option>
              </select>
              <input
                type="number"
                placeholder="Amount (₹)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              onClick={handleAdd}
              className="mt-3 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition"
            >
              ✅ Save Record
            </button>
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Crop</th>
                <th className="text-left px-4 py-3 text-gray-600">Type</th>
                <th className="text-left px-4 py-3 text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-gray-600">Note</th>
                <th className="text-left px-4 py-3 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.crop}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.type === 'revenue' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.type === 'revenue' ? '💚 Income' : '🔴 Expense'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-bold ${r.type === 'revenue' ? 'text-green-600' : 'text-red-500'}`}>
                    {r.type === 'revenue' ? '+' : '-'}₹{r.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.date}</td>
                  <td className="px-4 py-3 text-gray-500">{r.note}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}