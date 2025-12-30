// src/components/Dashboard/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { X, TrendingUp, Globe, Chrome, ExternalLink, Calendar, QrCode } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = ({ linkId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [linkId]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/links/${linkId}`);
      setData(response.data.link);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const dates = Object.keys(data.analytics.clicksByDate).sort();
  const clicks = dates.map(date => data.analytics.clicksByDate[date]);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Clicks',
        data: clicks,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b z-10">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-2xl font-bold text-gray-800 truncate">Link Analytics</h2>
            <a
              href={data.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline flex items-center gap-1 mt-1 truncate"
            >
              <span className="truncate">{data.shortUrl}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox
              icon={<TrendingUp className="w-6 h-6" />}
              label="Total Clicks"
              value={data.clicks}
              color="bg-blue-500"
            />
            <StatBox
              icon={<Calendar className="w-6 h-6" />}
              label="Recent Clicks (7d)"
              value={data.analytics.recentClicks}
              color="bg-green-500"
            />
            <StatBox
              icon={<Globe className="w-6 h-6" />}
              label="Last Clicked"
              value={data.lastClicked ? new Date(data.lastClicked).toLocaleDateString() : 'Never'}
              color="bg-purple-500"
            />
          </div>

          {dates.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Click Trend (Last 7 Days)</h3>
              <div className="w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Analytics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Top Countries</h3>
              </div>
              {data.analytics.topCountries.length > 0 ? (
                <div className="space-y-3">
                  {data.analytics.topCountries.map((country, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 truncate flex-1 mr-2">{country.name}</span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                        {country.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data yet</p>
              )}
            </div>

            {/* Top Browsers */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Chrome className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Top Browsers</h3>
              </div>
              {data.analytics.topBrowsers.length > 0 ? (
                <div className="space-y-3">
                  {data.analytics.topBrowsers.map((browser, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 truncate flex-1 mr-2">{browser.name}</span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                        {browser.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data yet</p>
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Referrers</h3>
            {data.analytics.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {data.analytics.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex justify-between items-center gap-4">
                    <span className="text-gray-700 truncate flex-1 min-w-0">{referrer.name}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                      {referrer.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data yet</p>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img 
                src={data.qrCode} 
                alt="QR Code" 
                className="w-32 h-32 border-2 border-purple-200 rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">QR Code</h3>
                </div>
                <p className="text-gray-600 mb-3">
                  Download and share this QR code for easy access to your link
                </p>
                <a
                  href={data.qrCode}
                  download={`qr-${data.shortCode}.png`}
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                >
                  Download QR Code
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 sm:p-6 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3">
        <div className={`${color} text-white p-3 rounded-lg flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-sm truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;