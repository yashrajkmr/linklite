// src/components/Dashboard/CreateLink.jsx
import React, { useState } from 'react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { Link, Calendar, Check, Copy, QrCode, AlertCircle } from 'lucide-react';

const CreateLink = ({ onLinkCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/links', {
        originalUrl,
        customAlias: customAlias || undefined,
        expiryDate: expiryDate || undefined
      });

      setCreatedLink(response.data.link);
      setOriginalUrl('');
      setCustomAlias('');
      setExpiryDate('');
      onLinkCreated();
      
      // Show success toast
      toast.success('Short link created successfully! 🎉');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create link';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(createdLink.shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCreatedLink(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Short Link</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {createdLink ? (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Link Created! 🎉</h3>
              <Check className="w-6 h-6 text-green-500" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={createdLink.shortUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-lg font-mono"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* QR Code */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
              <img 
                src={createdLink.qrCode} 
                alt="QR Code" 
                className="w-24 h-24 border border-gray-200 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-800">QR Code Generated</span>
                </div>
                <p className="text-sm text-gray-600">
                  Download or scan this QR code to share your link
                </p>
                <a
                  href={createdLink.qrCode}
                  download={`qr-${createdLink.shortCode}.png`}
                  className="inline-block mt-2 text-sm text-purple-600 hover:underline"
                >
                  Download QR Code
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Create Another Link
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original URL *
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="https://example.com/your-long-url"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Alias (Optional)
              </label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="my-custom-link"
              />
              <p className="text-xs text-gray-500 mt-1">3-20 characters, letters, numbers, dash, underscore</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Short Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateLink;