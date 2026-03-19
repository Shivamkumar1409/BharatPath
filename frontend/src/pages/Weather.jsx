import { useState, useEffect } from 'react';
import axios from 'axios';

const CITIES = [
  'Delhi', 'Mumbai', 'Lucknow', 'Patna', 'Jaipur',
  'Bhopal', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Chandigarh', 'Nagpur', 'Indore', 'Bhubaneswar', 'Raipur'
];

export default function Weather() {
  const [city, setCity] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather('Delhi');
  }, []);

  const fetchWeather = async (selectedCity) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`http://localhost:8000/weather/current?city=${selectedCity}`),
        axios.get(`http://localhost:8000/weather/forecast?city=${selectedCity}`)
      ]);
      if (weatherRes.data.error) {
        setError(weatherRes.data.error);
      } else {
        setWeather(weatherRes.data);
      }
      if (!forecastRes.data.error) {
        setForecast(forecastRes.data);
      }
    } catch (err) {
      setError('Could not fetch weather data.');
    }
    setLoading(false);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    fetchWeather(e.target.value);
  };

  const getWeatherBg = (desc) => {
    if (!desc) return 'from-blue-600 to-blue-400';
    desc = desc.toLowerCase();
    if (desc.includes('rain')) return 'from-gray-600 to-blue-500';
    if (desc.includes('cloud')) return 'from-gray-500 to-gray-400';
    if (desc.includes('clear')) return 'from-orange-500 to-yellow-400';
    if (desc.includes('storm')) return 'from-gray-800 to-gray-600';
    return 'from-blue-600 to-blue-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className={`bg-gradient-to-r ${getWeatherBg(weather?.description)} text-white px-6 py-8`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">🌤️ Farm Weather</h1>
          <p className="text-white text-opacity-80">Weather forecasts to plan your farming activities</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* City Selector */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Your City</label>
          <select
            value={city}
            onChange={handleCityChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3 animate-bounce">🌤️</span>
            <p className="text-gray-500">Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">⚠️ {error}</p>
            <p className="text-red-400 text-sm mt-1">Weather API key is activating. Please try again in 2 hours.</p>
          </div>
        )}

        {weather && !loading && (
          <>
            {/* Current Weather Card */}
            <div className={`bg-gradient-to-r ${getWeatherBg(weather.description)} rounded-2xl shadow-lg p-6 mb-6 text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{weather.city}</h2>
                  <p className="text-white text-opacity-80">{weather.description}</p>
                  <p className="text-6xl font-bold mt-4">{weather.temperature}°C</p>
                  <p className="text-white text-opacity-70 mt-1">Feels like {weather.feels_like}°C</p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="weather"
                  className="w-20 h-20"
                />
              </div>

              {/* Weather Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white border-opacity-30">
                <div className="text-center">
                  <p className="text-white text-opacity-70 text-sm">Humidity</p>
                  <p className="font-bold text-lg">{weather.humidity}%</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-opacity-70 text-sm">Wind</p>
                  <p className="font-bold text-lg">{weather.wind_speed} m/s</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-opacity-70 text-sm">Visibility</p>
                  <p className="font-bold text-lg">{weather.visibility} km</p>
                </div>
              </div>
            </div>

            {/* Farming Advice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-green-800 text-lg mb-2">🌾 Farming Advice</h3>
              <p className="text-green-700">{weather.farming_advice}</p>
            </div>

            {/* 5-item Forecast */}
            {forecast && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4">📅 Short-term Forecast</h3>
                <div className="space-y-3">
                  {forecast.forecasts.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`https://openweathermap.org/img/wn/${f.icon}.png`}
                          alt="weather"
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{f.description}</p>
                          <p className="text-gray-400 text-xs">{new Date(f.time).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{f.temp}°C</p>
                        <p className="text-gray-400 text-xs">{f.humidity}% humidity</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}