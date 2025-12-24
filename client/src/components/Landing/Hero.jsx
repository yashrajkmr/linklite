// src/components/Landing/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, BarChart3, Shield, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Shorten URLs, Track Success
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Create powerful short links with comprehensive analytics. 
            Perfect for marketers, developers, and businesses.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<LinkIcon className="w-10 h-10" />}
            title="Custom Short Links"
            description="Create branded short URLs with custom aliases"
          />
          <FeatureCard 
            icon={<BarChart3 className="w-10 h-10" />}
            title="Detailed Analytics"
            description="Track clicks, locations, devices, and more"
          />
          <FeatureCard 
            icon={<Shield className="w-10 h-10" />}
            title="Secure & Reliable"
            description="Password-protected links and expiry dates"
          />
          <FeatureCard 
            icon={<Zap className="w-10 h-10" />}
            title="Lightning Fast"
            description="Instant redirects with 99.9% uptime"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Links Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Clicks Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white hover:bg-opacity-20 transition transform hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-4 text-blue-200">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  );
};

export default Hero;