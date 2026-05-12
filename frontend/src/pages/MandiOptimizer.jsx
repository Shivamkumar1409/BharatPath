import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBestMandi, getPricePrediction } from '../services/api';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Mustard', 'Cotton', 'Sugarcane', 'Maize', 'Soyabean'];

export default function MandiOptimizer() {
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [district, setDistrict] = useState('');
  const [results, setResults] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predLoading, setPredLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!crop || !quantity) { setError('Please select crop and enter quantity'); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const res = await getBestMandi(crop, parseFloat(quantity), district);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setResults(res.data);
      }
    } catch {
      setError('Could not fetch mandi data. Please try again.');
    }
    setLoading(false);
  };

  const handlePrediction = async () => {
    if (!crop) { setError('Please select a crop first'); return; }
    setPredLoading(true); setError(null);
    try {
      const res = await getPricePrediction(crop);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setPrediction(res.data);
      }
    } catch {
      setError('Could not fetch price prediction.');
    }
    setPredLoading(false);
  };

  const medals = ['🥇', '🥈', '🥉'];
  const medalBorders = ['border-yellow-300', 'border-gray-300', 'border-orange-300'];
  const medalBgs = ['bg-yellow-50', 'bg-gray-50', 'bg-orange-50'];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-10 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-20"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [-8, 8, -8], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2">📊 Smart Mandi Optimizer</h1>
            <p className="text-blue-100">Live prices from Government of India — data.gov.in</p>
            <div className="flex items-center space-x-3 mt-3">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                🏛️ Ministry of Agriculture
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                📅 Updated Daily
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Input Form */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌾 Enter Crop Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => { setCrop(e.target.value); setResults(null); setPrediction(null); setError(null); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              >
                <option value="">Select Crop</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Quantity (kg)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">District (optional)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Delhi"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-red-500 text-sm">⚠️ {error}</p>
                <button
                  onClick={handleSubmit}
                  className="mt-1 text-xs text-blue-600 font-bold underline hover:no-underline"
                >
                  🔄 Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 font-bold rounded-xl transition shadow-md text-white flex items-center justify-center space-x-2 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                  <span>Fetching live prices...</span>
                </>
              ) : (
                <span>🔍 Find Best Mandi</span>
              )}
            </motion.button>

            <motion.button
              onClick={handlePrediction}
              disabled={predLoading}
              className={`px-8 py-3 font-bold rounded-xl transition shadow-md text-white flex items-center justify-center space-x-2 ${
                predLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              whileHover={!predLoading ? { scale: 1.02 } : {}}
              whileTap={!predLoading ? { scale: 0.98 } : {}}
            >
              {predLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                  <span>Predicting...</span>
                </>
              ) : (
                <span>📈 Predict Price</span>
              )}
            </motion.button>
          </div>

          {/* Loading Info Message */}
          <AnimatePresence>
            {(loading || predLoading) && (
              <motion.div
                className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex space-x-1 mt-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-blue-700 text-sm font-medium">
                      Fetching live prices from Government of India (data.gov.in)...
                    </p>
                    <p className="text-blue-500 text-xs mt-0.5">
                      ⚡ First load may take up to 30 seconds. Subsequent requests will be instant from cache.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mandi Results */}
        <AnimatePresence>
          {results && results.recommendations && results.recommendations.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-800">
                  🏆 Best Mandis for {results.crop}
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  🏛️ {results.source}
                </span>
              </div>

              <div className="space-y-3">
                {results.recommendations.map((mandi, i) => (
                  <motion.div
                    key={i}
                    className={`bg-white border ${medalBorders[i]} ${medalBgs[i]} rounded-2xl p-5`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.01, x: 3 }}
                    style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-2xl">{medals[i]}</span>
                          <h3 className="text-lg font-bold text-gray-800">{mandi.mandi}</h3>
                        </div>
                        <p className="text-gray-500 text-sm">📍 {mandi.district}, {mandi.state}</p>
                        <p className="text-gray-400 text-xs mt-1">📅 Data as of: {mandi.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-green-600">₹{mandi.price}</p>
                        <p className="text-gray-400 text-xs">per quintal</p>
                      </div>
                    </div>

                    {/* MSP Alert if available */}
                    {mandi.msp_alert && mandi.msp_alert !== 'no_msp' && (
                      <div className={`mt-3 p-2 rounded-lg text-sm font-medium ${
                        mandi.msp_alert === 'below'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : mandi.msp_alert === 'good' || mandi.msp_alert === 'excellent'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                      }`}>
                        {mandi.msp_message}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Revenue for {results.quantity}kg</span>
                      <span className="font-bold text-blue-600 text-lg">
                        ₹{mandi.estimated_revenue?.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Prediction */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  📈 Price Prediction — {prediction.crop}
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  🏛️ {prediction.source}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Predicted Next Price', value: `₹${prediction.predicted_price}`, sub: 'per quintal', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
                  { label: 'Price Trend', value: prediction.trend, sub: 'based on recent data', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
                  { label: 'Average Price', value: `₹${prediction.average_price}`, sub: 'per quintal', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`${item.bg} border ${item.border} rounded-xl p-4 text-center`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                    <p className={`text-2xl font-black ${item.text}`}>{item.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🏛️', title: 'Official Govt Data', desc: 'Live from data.gov.in — Ministry of Agriculture', bg: 'bg-blue-50', border: 'border-blue-100' },
            { icon: '📅', title: 'Updated Daily', desc: 'Fresh mandi prices every day from across India', bg: 'bg-green-50', border: 'border-green-100' },
            { icon: '🤖', title: 'AI Prediction', desc: 'Machine learning forecasts future crop prices', bg: 'bg-purple-50', border: 'border-purple-100' },
          ].map((card, i) => (
            <motion.div
              key={i}
              className={`${card.bg} border ${card.border} rounded-xl p-4 flex items-start space-x-3`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}