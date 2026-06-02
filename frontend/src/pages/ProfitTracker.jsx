import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { addProfitRecord, getProfitRecords, deleteProfitRecord } from '../services/api';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane', 'Maize', 'Soyabean'];

export default function ProfitTracker() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ crop: '', type: 'revenue', amount: '', note: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.email) fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    setFetching(true);
    try {
      const res = await getProfitRecords(user.email);
      setRecords(res.data.records || []);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
    setFetching(false);
  };

  const totalRevenue = records.filter(r => r.type === 'revenue').reduce((s, r) => s + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);

  const handleAdd = async () => {
    if (!form.crop || !form.amount) return;
    setLoading(true);
    try {
      await addProfitRecord({
        email: user.email,
        crop: form.crop,
        type: form.type,
        amount: parseFloat(form.amount),
        note: form.note,
        date: new Date().toISOString().split('T')[0],
      });
      setForm({ crop: '', type: 'revenue', amount: '', note: '' });
      setShowForm(false);
      setSuccess('Record saved to database! ✅');
      setTimeout(() => setSuccess(null), 3000);
      await fetchRecords();
    } catch (err) {
      console.error('Failed to add:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProfitRecord(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-10 relative overflow-hidden">
        <motion.div className="absolute -top-16 -right-16 w-48 h-48 bg-white rounded-full opacity-10"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2">💰 Profit Tracker</h1>
            <p className="text-yellow-100">Track your farm income and expenses — saved to database</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                💾 Auto-saved to Database
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                👤 {user?.name}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {success && (
          <motion.div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            {success}
          </motion.div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Revenue', value: totalRevenue, color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: '📈' },
            { label: 'Total Expenses', value: totalExpense, color: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: '📉' },
            { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-blue-600' : 'text-red-600', bg: 'bg-blue-50 border-blue-200', icon: '💰' },
          ].map((stat, i) => (
            <motion.div key={i} className={`${stat.bg} border rounded-2xl p-5`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02 }}
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>₹{stat.value.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">{records.filter(r => r.type === (stat.label.includes('Revenue') ? 'revenue' : stat.label.includes('Expense') ? 'expense' : '')).length} records</p>
            </motion.div>
          ))}
        </div>

        {/* Add Record Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {['all', 'revenue', 'expense'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  filter === f
                    ? f === 'all' ? 'bg-gray-800 text-white' : f === 'revenue' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                {f === 'all' ? '📋 All' : f === 'revenue' ? '💚 Income' : '🔴 Expense'}
              </button>
            ))}
          </div>
          <motion.button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-sm transition shadow-md"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {showForm ? '✕ Cancel' : '+ Add Record'}
          </motion.button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="bg-white rounded-2xl border border-yellow-200 p-5 mb-4"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <h3 className="font-bold text-gray-800 mb-3">📝 New Record</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Crop *</label>
                  <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50">
                    <option value="">Select Crop</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50">
                    <option value="revenue">💚 Income</option>
                    <option value="expense">🔴 Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₹) *</label>
                  <input type="number" value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Note</label>
                  <input type="text" value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="e.g. Sold 5 quintal"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50" />
                </div>
              </div>
              <motion.button onClick={handleAdd} disabled={loading || !form.crop || !form.amount}
                className={`px-6 py-2 font-bold rounded-xl text-sm transition text-white ${
                  !form.crop || !form.amount ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
                whileHover={form.crop && form.amount ? { scale: 1.02 } : {}}
                whileTap={form.crop && form.amount ? { scale: 0.98 } : {}}>
                {loading ? '💾 Saving to Database...' : '💾 Save Record'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Records as Cards */}
        {fetching ? (
          <div className="text-center py-12 text-gray-400">
            <motion.div className="text-5xl mb-2 inline-block"
              animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⏳</motion.div>
            <p>Loading your records from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-5xl block mb-3">📭</span>
            <p className="font-medium">No records found</p>
            <p className="text-sm mt-1">
              {filter === 'all' ? 'Add your first income or expense!' : `No ${filter} records yet`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r, i) => (
              <motion.div key={r.id}
                className={`bg-white rounded-2xl border-l-4 p-5 ${
                  r.type === 'revenue' ? 'border-l-green-500' : 'border-l-red-500'
                }`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02, y: -2 }}
                style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>

                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.type === 'revenue' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {r.type === 'revenue' ? '💚 Income' : '🔴 Expense'}
                    </span>
                    <span className="text-gray-600 font-bold text-sm">🌾 {r.crop}</span>
                  </div>
                  <button onClick={() => handleDelete(r.id)}
                    className="text-red-300 hover:text-red-500 text-xs transition">
                    🗑️
                  </button>
                </div>

                {/* Amount */}
                <p className={`text-3xl font-black mb-2 ${
                  r.type === 'revenue' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {r.type === 'revenue' ? '+' : '-'}₹{r.amount.toLocaleString()}
                </p>

                {/* Note */}
                {r.note && (
                  <p className="text-gray-500 text-sm mb-3 bg-gray-50 rounded-lg px-3 py-2">
                    📝 {r.note}
                  </p>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-400 text-xs">
                    📅 {new Date(r.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <span className="text-gray-300 text-xs">ID #{r.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}