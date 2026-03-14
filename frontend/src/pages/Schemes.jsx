import { useState } from 'react';

const SCHEMES = [
  {
    name: 'PM-KISAN',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmers in 3 installments.',
    eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
    category: 'Income Support',
    icon: '💰',
    color: 'border-green-400 bg-green-50',
    badge: 'bg-green-100 text-green-700',
    link: 'https://pmkisan.gov.in',
  },
  {
    name: 'PM Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities.',
    eligibility: 'All farmers growing notified crops in notified areas',
    category: 'Insurance',
    icon: '🛡️',
    color: 'border-blue-400 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    link: 'https://pmfby.gov.in',
  },
  {
    name: 'Kisan Credit Card',
    description: 'Provides farmers with affordable credit for agricultural needs including seeds, fertilizers and equipment.',
    eligibility: 'All farmers, sharecroppers and tenant farmers',
    category: 'Credit',
    icon: '💳',
    color: 'border-purple-400 bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
    link: 'https://www.nabard.org',
  },
  {
    name: 'PM Krishi Sinchai Yojana',
    description: 'Aims to provide water to every field — Har Khet Ko Pani and improve water use efficiency.',
    eligibility: 'All farmers needing irrigation support',
    category: 'Irrigation',
    icon: '💧',
    color: 'border-cyan-400 bg-cyan-50',
    badge: 'bg-cyan-100 text-cyan-700',
    link: 'https://pmksy.gov.in',
  },
  {
    name: 'Soil Health Card Scheme',
    description: 'Provides farmers with soil health cards containing crop-wise recommendations for nutrients and fertilizers.',
    eligibility: 'All farmers across India',
    category: 'Soil Health',
    icon: '🌱',
    color: 'border-yellow-400 bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
    link: 'https://soilhealth.dac.gov.in',
  },
  {
    name: 'eNAM',
    description: 'National Agriculture Market — online trading platform for agricultural commodities across India.',
    eligibility: 'All farmers who want to sell produce online',
    category: 'Market Access',
    icon: '🏪',
    color: 'border-orange-400 bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    link: 'https://enam.gov.in',
  },
  {
    name: 'Paramparagat Krishi Vikas Yojana',
    description: 'Promotes organic farming through cluster approach and provides financial assistance to farmers.',
    eligibility: 'Farmers interested in organic farming',
    category: 'Organic Farming',
    icon: '🌿',
    color: 'border-emerald-400 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    link: 'https://pgsindia-ncof.gov.in',
  },
  {
    name: 'Rashtriya Krishi Vikas Yojana',
    description: 'Incentivizes states to increase public investment in agriculture and allied sectors.',
    eligibility: 'Farmers in participating states',
    category: 'Development',
    icon: '📈',
    color: 'border-red-400 bg-red-50',
    badge: 'bg-red-100 text-red-700',
    link: 'https://rkvy.nic.in',
  },
];

const CATEGORIES = ['All', 'Income Support', 'Insurance', 'Credit', 'Irrigation', 'Soil Health', 'Market Access', 'Organic Farming', 'Development'];

export default function Schemes() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = SCHEMES.filter(s => {
    const matchCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">🏛️ Government Schemes</h1>
          <p className="text-purple-100">Discover schemes you are eligible for</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Search schemes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Schemes Count */}
        <p className="text-gray-500 text-sm mb-4">
          Showing {filtered.length} scheme{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((scheme, i) => (
            <div key={i} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${scheme.color} hover:shadow-lg transition flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{scheme.icon}</span>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{scheme.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${scheme.badge}`}>
                  {scheme.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{scheme.description}</p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">✅ Eligibility</p>
                <p className="text-sm text-gray-700">{scheme.eligibility}</p>
              </div>

              <a
                href={scheme.link}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition active:scale-[0.98]"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No schemes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}