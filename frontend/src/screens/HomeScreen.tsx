"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Glass from "../components/ui/Glass"
import GlassBadge from "../components/ui/GlassBadge"
import GlassFloatingButton from "../components/ui/GlassFloatingButton"

const HomeScreen: React.FC = () => {
  const { user } = useAuth()
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      title: "Discover Events",
      description: "Find amazing pools and events happening around you",
      icon: "🎉",
      color: "from-blue-500/20 to-purple-600/20",
    },
    {
      title: "Connect with People",
      description: "Meet like-minded individuals and build lasting connections",
      icon: "👥",
      color: "from-purple-500/20 to-pink-600/20",
    },
    {
      title: "Create Memories",
      description: "Share experiences and create unforgettable moments",
      icon: "📸",
      color: "from-teal-500/20 to-blue-600/20",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 relative overflow-hidden">
      {/* Animated glass background elements */}
      <div className="absolute inset-0">
        <Glass
          variant="colored"
          blur="xl"
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse opacity-30" children={undefined}        />
        <Glass
          variant="colored"
          blur="lg"
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-pulse delay-1000 opacity-20" children={undefined}        />
        <Glass
          variant="colored"
          blur="md"
          className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full animate-pulse delay-500 opacity-25" children={undefined}        />
      </div>

      <div className="relative z-10">
        {/* Glass Navigation */}
        <nav className="p-6">
          <Glass variant="colored" blur="lg" className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-blue-600 font-black text-xl">P</span>
              </div>
              <span className="text-white font-bold text-xl">Pool Party</span>
            </div>

            {user ? (
              <Glass variant="light" blur="sm" className="px-4 py-2">
                <span className="text-gray-800 font-medium">Welcome, {user.fullName}!</span>
              </Glass>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login">
                  <Glass variant="light" blur="sm" className="px-4 py-2 hover:scale-105 transition-transform">
                    <span className="text-gray-800 font-medium">Sign In</span>
                  </Glass>
                </Link>
                <Link to="/register">
                  <Glass variant="colored" blur="md" className="px-4 py-2 hover:scale-105 transition-transform">
                    <span className="text-white font-medium">Join Now</span>
                  </Glass>
                </Link>
              </div>
            )}
          </Glass>
        </nav>

        {/* Hero Section with Glass Elements */}
        <div className="text-center py-20 px-6">
          <Glass variant="colored" blur="xl" className="inline-block p-8 mb-8">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              Pool
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Party</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect, Share, and Create Amazing Experiences Together
            </p>
          </Glass>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/discover" : "/register"}>
              <Glass variant="light" blur="md" className="px-8 py-4 hover:scale-105 transition-all duration-300">
                <span className="text-gray-800 font-bold text-lg">{user ? "Explore Pools" : "Get Started"}</span>
              </Glass>
            </Link>
            <Link to="/discover">
              <Glass variant="colored" blur="lg" className="px-8 py-4 hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-lg">Discover Events</span>
              </Glass>
            </Link>
          </div>
        </div>

        {/* Features Section with Glass Cards */}
        <div className="py-20 px-6">
          <Glass variant="colored" blur="lg" className="max-w-6xl mx-auto p-8">
            <h2 className="text-4xl font-black text-white text-center mb-12">Why Choose Pool Party?</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Glass
                  key={index}
                  variant="light"
                  blur="md"
                  className={`p-6 hover:scale-105 transition-all duration-300 ${
                    index === currentFeature ? "ring-2 ring-white/50" : ""
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Glass>
              ))}
            </div>
          </Glass>
        </div>

        {/* Stats Section with Glass Elements */}
        <div className="py-20 px-6">
          <Glass variant="dark" blur="xl" className="max-w-4xl mx-auto p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Glass variant="colored" blur="md" className="p-6 mb-4">
                  <div className="text-3xl font-black text-white">10K+</div>
                </Glass>
                <p className="text-white/80">Active Users</p>
              </div>
              <div>
                <Glass variant="colored" blur="md" className="p-6 mb-4">
                  <div className="text-3xl font-black text-white">500+</div>
                </Glass>
                <p className="text-white/80">Events Created</p>
              </div>
              <div>
                <Glass variant="colored" blur="md" className="p-6 mb-4">
                  <div className="text-3xl font-black text-white">50+</div>
                </Glass>
                <p className="text-white/80">Cities</p>
              </div>
            </div>
          </Glass>
        </div>

        {/* Call to Action with Glass */}
        <div className="py-20 px-6 text-center">
          <Glass variant="colored" blur="xl" className="max-w-2xl mx-auto p-12">
            <h2 className="text-4xl font-black text-white mb-6">Ready to Dive In?</h2>
            <p className="text-xl text-white/90 mb-8">Join thousands of people creating amazing memories together</p>
            <Link to={user ? "/discover" : "/register"}>
              <Glass
                variant="light"
                blur="md"
                className="inline-block px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                <span className="text-gray-800 font-bold text-lg">{user ? "Start Exploring" : "Join Pool Party"}</span>
              </Glass>
            </Link>
          </Glass>
        </div>
      </div>

      {/* Floating Glass Action Button */}
      <GlassFloatingButton variant="primary" size="lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </GlassFloatingButton>

      {/* Glass Status Badges */}
      <div className="fixed top-6 left-6 space-y-2">
        <GlassBadge variant="success" pulse>
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Online
        </GlassBadge>
        <GlassBadge variant="info">
          <span className="mr-1">🎉</span>
          New Events
        </GlassBadge>
      </div>
    </div>
  )
}

export default HomeScreen
