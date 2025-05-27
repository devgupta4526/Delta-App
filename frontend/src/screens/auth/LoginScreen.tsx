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
const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(formData.email, formData.password)
      navigate("/discover")
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6 py-12"
      style={{ backgroundImage: `url(${img})` }}

    >
      <div className="grid md:grid-cols-2 bg-white/80 rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Left Panel */}
        <div className="p-10 flex flex-col justify-between text-white bg-black/40 relative">
          <div>
            <h1 className="text-5xl font-bold">Welcome<br />Back</h1>
            <p className="mt-4 text-lg">
            Join the splash — find and host epic pool parties with ease!
            </p>
          </div>

          <div className="mt-8 flex gap-4 text-2xl">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaYoutube />
          </div>
        </div>

        {/* Right Panel - Sign In */}
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between text-sm text-gray-700">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Lost your password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" variant="gradient" size="lg">
              Sign in now
            </Button>

            <div className="text-center text-sm text-gray-700">
              By clicking on "Sign in now" you agree to{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
              &{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </div>

            {/* Social Login */}
            <div className="flex items-center gap-4 mt-6 justify-center">
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                <FaGoogle className="text-red-500" />
                Google
              </button>
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                <FaApple className="text-black" />
                Apple
              </button>
            </div>

            <div className="text-center mt-6 text-gray-700">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
