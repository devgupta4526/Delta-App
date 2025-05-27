"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Card from "../../components/ui/Card"
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGoogle, FaApple } from "react-icons/fa"
import img from "../../assets/login3.jpg"

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [files, setFiles] = useState({
    avatar: null as File | null,
    coverImage: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target
    if (fileList && fileList[0]) {
      setFiles({
        ...files,
        [name]: fileList[0],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("username", formData.username)
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("password", formData.password)

      if (files.avatar) {
        formDataToSend.append("avatar", files.avatar)
      }
      if (files.coverImage) {
        formDataToSend.append("coverImage", files.coverImage)
      }

      await register(formDataToSend)
      navigate("/login")
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6 py-12"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="grid md:grid-cols-2 bg-white/80 rounded-xl shadow-2xl overflow-hidden max-w-6xl w-full">
        {/* Left Panel */}
        <div className="p-10 flex flex-col justify-between text-white bg-black/40 relative">
          <div>
            <h1 className="text-5xl font-bold">Join The<br />Splash</h1>
            <p className="mt-4 text-lg">
              Create your account and discover amazing pool parties in your area. Connect, party, and make a splash!
            </p>
          </div>

          <div className="mt-8 flex gap-4 text-2xl">
            <FaFacebook className="hover:text-blue-400 transition-colors cursor-pointer" />
            <FaTwitter className="hover:text-blue-300 transition-colors cursor-pointer" />
            <FaInstagram className="hover:text-pink-400 transition-colors cursor-pointer" />
            <FaYoutube className="hover:text-red-400 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Right Panel - Sign Up */}
        <div className="p-10 max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />

              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-700">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline ml-1">
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline ml-1">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" loading={loading} className="w-full" variant="gradient" size="lg">
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-700">
              By creating an account, you join our community of pool party enthusiasts!
            </div>

            {/* Social Login */}
            <div className="flex items-center gap-4 mt-6 justify-center">
              <button 
                type="button"
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <FaGoogle className="text-red-500" />
                Google
              </button>
              <button 
                type="button"
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <FaApple className="text-black" />
                Apple
              </button>
            </div>

            <div className="text-center mt-6 text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterScreen