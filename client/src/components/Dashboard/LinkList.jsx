// src/components/Dashboard/LinkList.jsx
import React, { useState } from 'react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import Analytics from './Analytics';
import { 
  ExternalLink, Trash2, BarChart3, Copy, Check, 
  Search, Calendar, MousePointerClick, Eye, EyeOff 
} from 'lucide-react';

const LinkList = ({ links, loading, onLinkDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLink, setSelectedLink] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredLinks = links.filter(link =>
    link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (shortUrl, linkId) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(linkId);
    toast.success('Link copied to clipboard! 📋');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (linkId) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await api.delete(`/links/${linkId}`);
      toast.success('Link deleted successfully! 🗑️');
      onLinkDeleted();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link. Please try again.');
    }
  };

  const handleToggleActive = async (link) => {
    try {
      await api.patch(`/links/${link.id}`, {
        isActive: !link.isActive,
        expiryDate: link.expiryDate
      });
      const statusText = !link.isActive ? 'enabled' : 'disabled';
      toast.success(`Link ${statusText} successfully!`);
      onLinkDeleted(); 
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link. Please try again.');
    }
  };

  const handleViewAnalytics = (link) => {
    setSelectedLink(link);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-gray-500">Loading your links...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Links</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {filteredLinks.length === 0 ? (
          <div className="text-center py-16">
            {searchTerm ? (
              <>
                <div className="mb-4">
                  <Search className="w-16 h-16 mx-auto text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">No links found</p>
                <p className="text-gray-400">Try searching with different keywords</p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-purple-100 to-blue-100 rounded-full p-8">
                      <ExternalLink className="w-16 h-16 text-purple-600" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No links yet!</h3>
                <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                  Create your first short link above and start tracking clicks 👆
                </p>
                <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Easy to share</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Track analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>QR codes included</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                onViewAnalytics={handleViewAnalytics}
                isCopied={copiedId === link.id}
              />
            ))}
          </div>
        )}
      </div>

      {selectedLink && (
        <Analytics
          linkId={selectedLink.id}
          onClose={() => setSelectedLink(null)}
        />
      )}
    </>
  );
};

const LinkCard = ({ link, onCopy, onDelete, onToggleActive, onViewAnalytics, isCopied }) => {
  const isExpired = link.expiryDate && new Date(link.expiryDate) < new Date();

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition ${
      !link.isActive || isExpired ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <a
              href={link.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-purple-600 hover:underline truncate"
            >
              {link.shortUrl}
            </a>
            <button
              onClick={() => onCopy(link.shortUrl, link.id)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy link"
            >
              {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{link.originalUrl}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MousePointerClick className="w-4 h-4" />
              <span>{link.clicks} clicks</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(link.createdAt).toLocaleDateString()}</span>
            </div>
            {link.expiryDate && (
              <div className="flex items-center gap-1">
                <span className={isExpired ? 'text-red-500 font-medium' : ''}>
                  {isExpired ? '⚠️ Expired' : `Expires: ${new Date(link.expiryDate).toLocaleDateString()}`}
                </span>
              </div>
            )}
            {!link.isActive && (
              <span className="text-orange-500 font-medium">⛔ Disabled</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleActive(link)}
            className={`p-2 rounded hover:bg-gray-100 transition ${
              link.isActive ? 'text-green-600' : 'text-gray-400'
            }`}
            title={link.isActive ? 'Disable link' : 'Enable link'}
          >
            {link.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onViewAnalytics(link)}
            className="p-2 text-blue-600 rounded hover:bg-blue-50 transition"
            title="View analytics"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 text-red-600 rounded hover:bg-red-50 transition"
            title="Delete link"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkList;