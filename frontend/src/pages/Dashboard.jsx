import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const priceData = [
  { month: 'Oct', price: 1800 },
  { month: 'Nov', price: 1950 },
  { month: 'Dec', price: 2100 },
  { month: 'Jan', price: 1990 },
  { month: 'Feb', price: 2200 },
  { month: 'Mar', price: 2350 },
];

const stats = [
  { label: 'Total Profit', value: '₹45,200', icon: '💰', color: 'bg-green-100 border-green-300', text: 'text-green-700' },
  { label: 'Crops Analyzed', value: '12', icon: '🌿', color: 'bg-blue-100 border-blue-300', text: 'text-blue-700' },
  { label: 'Diseases Detected', value: '3', icon: '🔬', color: 'bg-red-100 border-red-300', text: 'text-red-700' },
  { label: 'Schemes Available', value: '8', icon: '🏛️', color: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-700' },
];

const quickLinks = [
  { path: '/disease', label: 'Detect Crop Disease', icon: '🔬', desc: 'Upload leaf image for AI diagnosis', color: 'bg-green-600 hover:bg-green-700' },
  { path: '/mandi', label: 'Find Best Mandi', icon: '📊', desc: 'Get best market price for your crop', color: 'bg-blue-600 hover:bg-blue-700' },
  { path: '/profit', label: 'Track Profit', icon: '💰', desc: 'Record expenses and calculate profit', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { path: '/schemes', label: 'Gov. Schemes', icon: '🏛️', desc: 'Find eligible government schemes', color: 'bg-purple-600 hover:bg-purple-700' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            नमस्ते, किसान भाई! 🌾
          </h1>
          <p className="text-green-100 text-lg">
            Welcome to BharatPath — Your Smart Farming Assistant
          </p>
          <p className="text-green-200 text-sm mt-1">
            Today's Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.color} border rounded-xl p-4 flex items-center space-x-3`}>
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                <p className="text-gray-600 text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Cards */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className={`${link.color} text-white rounded-xl p-5 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1`}
            >
              <span className="text-4xl block mb-3">{link.icon}</span>
              <h3 className="font-bold text-lg mb-1">{link.label}</h3>
              <p className="text-sm opacity-80">{link.desc}</p>
            </Link>
          ))}
        </div>

        {/* Price Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">📈 Wheat Price Trend</h2>
          <p className="text-gray-500 text-sm mb-4">Price per quintal (₹) — Last 6 months</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`₹${value}`, 'Price']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weather + Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Farming Tips */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🌱 Farming Tips</h2>
            <ul className="space-y-3">
              {[
                { tip: 'Check soil moisture before irrigation', icon: '💧' },
                { tip: 'Use organic fertilizers for better yield', icon: '🌿' },
                { tip: 'Early morning is best time for spraying', icon: '🌅' },
                { tip: 'Rotate crops every season to maintain soil health', icon: '🔄' },
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-gray-600">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Season Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border border-yellow-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🌾 Current Season</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Season</span>
                <span className="font-bold text-orange-600">Rabi (रबी)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Key Crops</span>
                <span className="font-bold text-green-600">Wheat, Mustard</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Harvest Time</span>
                <span className="font-bold text-yellow-600">March - April</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">MSP Wheat</span>
                <span className="font-bold text-green-700">₹2,275/quintal</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}