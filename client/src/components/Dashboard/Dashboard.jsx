// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import CreateLink from './CreateLink';
import LinkList from './LinkList';
import { BarChart3, Link as LinkIcon, MousePointerClick } from 'lucide-react';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/links');
      setLinks(response.data.links);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLinkDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const activeLinks = links.filter(link => link.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage and track your short links</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<LinkIcon className="w-8 h-8" />}
            title="Total Links"
            value={totalLinks}
            color="bg-blue-500"
          />
          <StatCard
            icon={<MousePointerClick className="w-8 h-8" />}
            title="Total Clicks"
            value={totalClicks}
            color="bg-green-500"
          />
          <StatCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Active Links"
            value={activeLinks}
            color="bg-purple-500"
          />
        </div>

        {/* Create Link Section */}
        <div className="mb-8">
          <CreateLink onLinkCreated={handleLinkCreated} />
        </div>

        {/* Links List */}
        <div>
          <LinkList 
            links={links} 
            loading={loading} 
            onLinkDeleted={handleLinkDeleted}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;