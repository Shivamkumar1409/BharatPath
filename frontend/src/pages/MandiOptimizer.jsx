import { useState } from 'react';
import { getBestMandi, getPricePrediction } from '../services/api';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane'];

export default function MandiOptimizer() {
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [district, setDistrict] = useState('');
  const [results, setResults] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!crop || !quantity || !district) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getBestMandi({
        crop,
        quantity: parseFloat(quantity),
        farmer_district: district,
      });
      setResults(res.data.recommendations);
    } catch (err) {
      setError('Could not fetch mandi data. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">📊 Smart Mandi Optimizer</h1>
          <p className="text-blue-100">Find the best market to sell your crop for maximum profit</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌾 Enter Crop Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Crop Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Crop</option>
                {CROPS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Lucknow"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">⚠️ {error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md"
          >
            {loading ? '🔄 Finding Best Mandi...' : '🔍 Find Best Mandi'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">🏆 Best Mandis for You</h2>
            {results.map((mandi, i) => (
              <div key={i} className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                i === 0 ? 'border-yellow-400' : i === 1 ? 'border-gray-400' : 'border-orange-400'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <h3 className="text-lg font-bold text-gray-800">{mandi.mandi}</h3>
                    </div>
                    <p className="text-gray-500 text-sm">📍 {mandi.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{mandi.price}</p>
                    <p className="text-gray-400 text-xs">per quintal</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Revenue</span>
                  <span className="font-bold text-blue-600">₹{mandi.estimated_revenue?.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📍', title: 'Location Based', desc: 'Recommendations based on your district location' },
            { icon: '💹', title: 'Live Prices', desc: 'Real mandi prices from AGMARKNET database' },
            { icon: '🚛', title: 'Profit Calculator', desc: 'Net profit after transport cost calculation' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-start space-x-3 border border-gray-100">
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}