import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Clock, RefreshCcw } from 'lucide-react';

interface BitcoinData {
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  last_updated: string;
}

function App() {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoinData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_high=true&include_24hr_low=true&include_last_updated_at=true'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      if (!data.bitcoin) {
        throw new Error('Invalid data format');
      }

      setBitcoinData({
        current_price: data.bitcoin.usd,
        price_change_percentage_24h: data.bitcoin.usd_24h_change,
        high_24h: data.bitcoin.usd_24h_high,
        low_24h: data.bitcoin.usd_24h_low,
        last_updated: new Date(data.bitcoin.last_updated_at * 1000).toLocaleString()
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch Bitcoin data. Please try again later.');
      setBitcoinData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bitcoin className="w-10 h-10 text-yellow-500" />
            <h1 className="text-3xl font-bold">Bitcoin Tracker</h1>
          </div>
          <button
            onClick={fetchBitcoinData}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-lg"
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`bg-gray-800 p-6 rounded-xl shadow-lg ${i === 3 ? 'md:col-span-2' : ''}`}>
                <div className="h-20 bg-gray-700 animate-pulse rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : bitcoinData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 font-medium">Current Price</h2>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-4xl font-bold">${bitcoinData.current_price.toLocaleString()}</p>
              <div className={`flex items-center gap-2 mt-2 ${
                bitcoinData.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {bitcoinData.price_change_percentage_24h >= 0 ? 
                  <TrendingUp className="w-5 h-5" /> : 
                  <TrendingDown className="w-5 h-5" />
                }
                <span className="font-medium">
                  {bitcoinData.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 font-medium">24h High/Low</h2>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-green-400">
                  High: ${bitcoinData.high_24h.toLocaleString()}
                </p>
                <p className="text-red-400">
                  Low: ${bitcoinData.low_24h.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-400 font-medium">Last Updated</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-lg">{bitcoinData.last_updated}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;