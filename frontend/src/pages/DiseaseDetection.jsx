import { useState } from 'react';
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
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">🔬 Crop Disease Detection</h1>
          <p className="text-green-100">Upload a leaf image — our AI will diagnose the disease instantly</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Upload Leaf Image</h2>

            {/* Upload Box */}
            <label className="block w-full border-2 border-dashed border-green-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
              {preview ? (
                <img src={preview} alt="preview" className="mx-auto max-h-48 rounded-lg object-contain" />
              ) : (
                <div>
                  <span className="text-5xl block mb-3">🌿</span>
                  <p className="text-green-600 font-medium">Click to upload leaf image</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG supported</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {preview && (
              <p className="text-green-600 text-sm mt-2 text-center">✅ Image selected: {file?.name}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${
                !file || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? '🔄 Analyzing...' : '🔬 Detect Disease'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Detection Result</h2>

            {!result && !loading && (
              <div className="text-center py-12 text-gray-400">
                <span className="text-5xl block mb-3">🌱</span>
                <p>Upload a leaf image to see results</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <span className="text-5xl block mb-3 animate-bounce">🔬</span>
                <p className="text-green-600 font-medium">AI is analyzing your image...</p>
                <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Disease Detected</p>
                  <p className="text-xl font-bold text-green-800">{result.disease}</p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confidence Score</p>
                  <p className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">💊 Recommended Treatment</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{result.treatment}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '🎯', title: 'High Accuracy', desc: 'MobileNetV2 AI model trained on 50,000+ plant images' },
            { icon: '⚡', title: 'Instant Results', desc: 'Get disease diagnosis in seconds' },
            { icon: '💊', title: 'Treatment Guide', desc: 'Receive specific treatment recommendations' },
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