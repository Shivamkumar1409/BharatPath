import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectDisease } from '../services/api';

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setError(null);
    try {
      const res = await detectDisease(formData);
      setResult(res.data);
    } catch (err) {
      setError('Could not detect disease. Please try again.');
    }
    setLoading(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Animated Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 text-white py-12 px-6">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full opacity-40"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl font-black mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                🔬 Crop Disease Detection
              </span>
            </h1>
            <p className="text-green-300">Upload a leaf image — AI diagnoses disease instantly</p>
            <div className="flex items-center space-x-3 mt-3">
              <span className="px-3 py-1 bg-green-900 bg-opacity-60 rounded-full text-green-300 text-xs border border-green-700">
                🤖 MobileNetV2 AI Model
              </span>
              <span className="px-3 py-1 bg-blue-900 bg-opacity-60 rounded-full text-blue-300 text-xs border border-blue-700">
                📊 50,000+ Training Images
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upload Section */}
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">📸 Upload Leaf Image</h2>

            <motion.label
              className="block w-full border-2 border-dashed border-green-700 rounded-2xl p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-950 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {preview ? (
                <motion.img
                  src={preview}
                  alt="preview"
                  className="mx-auto max-h-48 rounded-xl object-contain"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                />
              ) : (
                <div>
                  <motion.span
                    className="text-5xl block mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >🌿</motion.span>
                  <p className="text-green-400 font-medium">Click to upload leaf image</p>
                  <p className="text-gray-500 text-sm mt-1">JPG, PNG supported</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </motion.label>

            {preview && (
              <motion.p
                className="text-green-400 text-sm mt-2 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                ✅ {file?.name}
              </motion.p>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${
                !file || loading
                  ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
              }`}
              whileHover={file && !loading ? { scale: 1.02 } : {}}
              whileTap={file && !loading ? { scale: 0.98 } : {}}
              style={{ boxShadow: file && !loading ? '0 0 20px rgba(74, 222, 128, 0.3)' : 'none' }}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>🔄</motion.span>
                  <span>Analyzing...</span>
                </span>
              ) : '🔬 Detect Disease'}
            </motion.button>

            {error && (
              <motion.div
                className="mt-4 p-3 bg-red-950 border border-red-700 rounded-xl text-red-400 text-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                ⚠️ {error}
              </motion.div>
            )}
          </motion.div>

          {/* Result Section */}
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          >
            <h2 className="text-xl font-bold text-white mb-4">📋 Detection Result</h2>

            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="empty"
                  className="text-center py-12 text-gray-600"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.span
                    className="text-5xl block mb-3"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >🌱</motion.span>
                  <p>Upload a leaf image to see results</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  className="text-center py-12"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.span
                    className="text-5xl block mb-3"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >🔬</motion.span>
                  <p className="text-green-400 font-medium">AI is analyzing your image...</p>
                  <div className="flex justify-center space-x-1 mt-3">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    className="p-4 bg-green-950 border border-green-700 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Disease Detected</p>
                    <p className="text-xl font-bold text-green-300">{result.disease}</p>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-blue-950 border border-blue-700 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Confidence Score</p>
                    <p className={`text-3xl font-black ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                    <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 bg-yellow-950 border border-yellow-700 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">💊 Treatment</p>
                    <p className="text-yellow-200 text-sm leading-relaxed">{result.treatment}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '🎯', title: 'High Accuracy', desc: 'MobileNetV2 trained on 50,000+ plant images', color: 'border-green-700' },
            { icon: '⚡', title: 'Instant Results', desc: 'Get disease diagnosis in seconds', color: 'border-blue-700' },
            { icon: '💊', title: 'Treatment Guide', desc: 'Specific treatment recommendations', color: 'border-yellow-700' },
          ].map((card, i) => (
            <motion.div
              key={i}
              className={`bg-gray-900 border ${card.color} rounded-xl p-4 flex items-start space-x-3`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -3 }}
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
            >
              <span className="text-3xl">{card.icon}</span>
              <div>
                <h3 className="font-bold text-white">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}