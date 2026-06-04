import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeCropHealth } from '../services/api';

export default function CropHealth() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [city, setCity] = useState('Delhi');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const CITIES = ['Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Jaipur', 'Bhopal',
    'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Chandigarh', 'Nagpur'];

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('image/')) {
      handleFileChange(dropped);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('city', city);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeCropHealth(formData);
      if (!res.data.success) {
        setError(res.data.error || 'Detection failed. Please try again.');
      } else {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not connect to AI model. Please try again.');
    }
    setLoading(false);
  };

  const getHealthColor = (score) => {
    if (score >= 75) return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-500' };
    if (score >= 50) return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', bar: 'bg-yellow-500' };
    if (score >= 25) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500' };
    return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500' };
  };

  const getRiskColor = (risk) => {
    const r = risk?.toLowerCase();
    if (r === 'low') return 'bg-green-100 text-green-700';
    if (r === 'medium' || r === 'moderate') return 'bg-yellow-100 text-yellow-700';
    if (r === 'high') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-600';
  };

  const getAlertColor = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes('critical') || t?.includes('danger')) return 'bg-red-50 border-red-200 text-red-700';
    if (t?.includes('warn')) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 text-white py-10 px-6">
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [-8, 8, -8], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-yellow-200">
                🔬 AI Crop Health Analysis
              </span>
            </h1>
            <p className="text-green-200">Advanced EfficientNetV2-B0 pipeline — crop health analysis, risk analysis & weather-aware recommendations</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['🤖 EfficientNetV2-B0 Model', '✅ Leaf Validation', '📊 Quality Check', '🌤️ Weather-Aware', '💊 Smart Recommendations'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs border border-white border-opacity-30">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Upload + City Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Upload Card */}
          <motion.div className="bg-white rounded-2xl border border-gray-100 p-6"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">📸 Upload Leaf Image</h2>

            {/* Drop Zone */}
            <motion.label
              className={`block w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                dragOver ? 'border-green-400 bg-green-50' : 'border-green-300 hover:border-green-400 hover:bg-green-50'
              }`}
              whileHover={{ scale: 1.01 }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <motion.img src={preview} alt="preview"
                  className="mx-auto max-h-48 rounded-xl object-contain shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} />
              ) : (
                <div>
                  <motion.span className="text-5xl block mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}>🌿</motion.span>
                  <p className="text-green-600 font-bold">Click or drag & drop leaf image</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG supported</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])} />
            </motion.label>

            {file && (
              <motion.p className="text-green-500 text-xs mt-2 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ✅ {file.name}
              </motion.p>
            )}

            {/* City Selector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">📍 Your City (for weather analysis)</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-gray-700">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Analyze Button */}
            <motion.button onClick={handleSubmit} disabled={!file || loading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${
                !file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
              }`}
              whileHover={file && !loading ? { scale: 1.02 } : {}}
              whileTap={file && !loading ? { scale: 0.98 } : {}}
              style={{ boxShadow: file && !loading ? '0 0 20px rgba(74,222,128,0.3)' : 'none' }}>
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <motion.span animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>🔄</motion.span>
                  <span>AI Analyzing...</span>
                </span>
              ) : '🔬 Analyze Crop Health'}
            </motion.button>
          </motion.div>

          {/* Status / Empty Card */}
          <motion.div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

            {!result && !loading && !error && (
              <div className="text-center py-8">
                <motion.span className="text-6xl block mb-4"
                  animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>🌱</motion.span>
                <p className="text-gray-500 font-medium">Upload a leaf image to get started</p>
                <p className="text-gray-400 text-sm mt-2">Our AI will analyze crophealth, quality, risk level and provide weather-based recommendations</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <motion.span className="text-6xl block mb-4"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}>🔬</motion.span>
                <p className="text-green-600 font-bold text-lg">AI is analyzing...</p>
                <div className="space-y-2 mt-4 text-left">
                  {['Validating leaf image...', 'Checking image quality...', 'Running health model...', 'Analyzing weather risk...', 'Generating recommendations...'].map((step, i) => (
                    <motion.div key={i}
                      className="flex items-center space-x-2 text-sm text-gray-500"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4 }}>
                      <motion.span animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}>⚙️</motion.span>
                      <span>{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {error && !loading && (
              <motion.div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="text-4xl block mb-2">⚠️</span>
                <p className="text-red-600 font-bold">Analysis Failed</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
                <button onClick={() => { setError(null); setFile(null); setPreview(null); }}
                  className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition">
                  Try Again
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div className="space-y-4"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

              {/* Health Score Card */}
              {(() => {
                const colors = getHealthColor(result.health_score);
                return (
                  <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6`}
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-black text-gray-800">🌿 Crop Health Analysis</h2>
                        <p className={`text-2xl font-black mt-1 ${colors.text}`}>
                          {result.health_condition}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-5xl font-black ${colors.text}`}>{result.health_score}%</p>
                        <p className="text-gray-500 text-xs">Health Score</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${getRiskColor(result.risk_level)}`}>
                          {result.risk_level} Risk
                        </span>
                      </div>
                    </div>

                    {/* Health Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Health Score</span>
                        <span>{result.health_score}%</span>
                      </div>
                      <div className="bg-white rounded-full h-3 overflow-hidden border border-gray-200">
                        <motion.div className={`h-full ${colors.bar} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.health_score}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }} />
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                        <p className="text-gray-400 text-xs mb-1">Confidence</p>
                        <p className={`text-xl font-black ${colors.text}`}>{result.confidence_percent}%</p>
                        <p className="text-gray-400 text-xs">{result.confidence_level}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                        <p className="text-gray-400 text-xs mb-1">Blur Score</p>
                        <p className="text-xl font-black text-blue-600">{result.image_quality?.blur_score}</p>
                        <p className="text-gray-400 text-xs">Image Quality</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                        <p className="text-gray-400 text-xs mb-1">Brightness</p>
                        <p className="text-xl font-black text-purple-600">{result.image_quality?.brightness}</p>
                        <p className="text-gray-400 text-xs">Light Level</p>
                      </div>
                    </div>

                    {result.confidence_message && (
                      <p className="text-gray-500 text-sm mt-3 bg-white rounded-xl p-3 border border-gray-100">
                        💬 {result.confidence_message}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Weather Card */}
              {result.weather && (
                <motion.div className="bg-white rounded-2xl border border-blue-100 p-5"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
                  <h3 className="font-bold text-gray-800 mb-3">🌤️ Current Weather — {result.weather.city}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Temperature', value: `${result.weather.temperature}°C`, icon: '🌡️', color: 'text-orange-600' },
                      { label: 'Humidity', value: `${result.weather.humidity}%`, icon: '💧', color: 'text-blue-600' },
                      { label: 'Wind Speed', value: `${result.weather.wind_speed} m/s`, icon: '💨', color: 'text-cyan-600' },
                      { label: 'Condition', value: result.weather.condition, icon: '🌥️', color: 'text-gray-600' },
                    ].map((item, i) => (
                      <div key={i} className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                        <span className="text-2xl block mb-1">{item.icon}</span>
                        <p className={`font-black text-base ${item.color}`}>{item.value}</p>
                        <p className="text-gray-400 text-xs">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Alerts */}
              {result.alerts && result.alerts.length > 0 && (
                <motion.div className="space-y-2"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}>
                  <h3 className="font-bold text-gray-800">🚨 Active Alerts</h3>
                  {result.alerts.map((alert, i) => (
                    <motion.div key={i}
                      className={`border rounded-xl p-4 ${getAlertColor(alert.type || '')}`}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}>
                      <p className="font-bold text-sm">{alert.title || alert.message || alert}</p>
                      {alert.description && <p className="text-sm mt-1 opacity-75">{alert.description}</p>}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Recommendations */}
              {result.recommendations && (
                <motion.div className="bg-white rounded-2xl border border-gray-100 p-6"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                  <h3 className="font-bold text-gray-800 text-lg mb-4">💊 Recommendations</h3>
                  <div className="space-y-4">

                    {/* High Priority */}
                    {result.recommendations.high_priority?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-red-600 mb-2">🔴 High Priority</h4>
                        <div className="space-y-2">
                          {result.recommendations.high_priority.map((rec, i) => (
                            <motion.div key={i}
                              className="flex items-start space-x-3 p-3 bg-red-50 border border-red-100 rounded-xl"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.08 }}
                              whileHover={{ x: 3 }}>
                              <span className="text-red-500 mt-0.5 flex-shrink-0">⚠️</span>
                              <p className="text-gray-700 text-sm">{typeof rec === 'string' ? rec : rec.text || rec.message || JSON.stringify(rec)}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preventive */}
                    {result.recommendations.preventive?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-blue-600 mb-2">🔵 Preventive Measures</h4>
                        <div className="space-y-2">
                          {result.recommendations.preventive.map((rec, i) => (
                            <motion.div key={i}
                              className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-100 rounded-xl"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.08 }}
                              whileHover={{ x: 3 }}>
                              <span className="text-blue-500 mt-0.5 flex-shrink-0">🛡️</span>
                              <p className="text-gray-700 text-sm">{typeof rec === 'string' ? rec : rec.text || rec.message || JSON.stringify(rec)}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Monitoring */}
                    {result.recommendations.monitoring?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-green-600 mb-2">🟢 Monitoring</h4>
                        <div className="space-y-2">
                          {result.recommendations.monitoring.map((rec, i) => (
                            <motion.div key={i}
                              className="flex items-start space-x-3 p-3 bg-green-50 border border-green-100 rounded-xl"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.08 }}
                              whileHover={{ x: 3 }}>
                              <span className="text-green-500 mt-0.5 flex-shrink-0">👁️</span>
                              <p className="text-gray-700 text-sm">{typeof rec === 'string' ? rec : rec.text || rec.message || JSON.stringify(rec)}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Analyze Again Button */}
              <motion.button
                onClick={() => { setResult(null); setFile(null); setPreview(null); setError(null); }}
                className="w-full py-3 border-2 border-green-300 text-green-600 hover:bg-green-50 font-bold rounded-xl transition"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                🔄 Analyze Another Image
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: '✅', title: 'Leaf Validation', desc: 'AI first validates that uploaded image is actually a plant/crop leaf', color: 'border-green-100 bg-green-50' },
              { icon: '📊', title: 'Quality Check', desc: 'Checks blur score and brightness before running crop health analysis', color: 'border-blue-100 bg-blue-50' },
              { icon: '🌤️', title: 'Weather-Aware', desc: 'Combines crop health analysis with real-time weather for smarter recommendations', color: 'border-yellow-100 bg-yellow-50' },
            ].map((card, i) => (
              <motion.div key={i}
                className={`border ${card.color} rounded-xl p-4 flex items-start space-x-3`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}>
                <span className="text-3xl">{card.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{card.title}</h3>
                  <p className="text-gray-500 text-sm">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}