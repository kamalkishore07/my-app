'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Lock, Eye, EyeOff, User, Mail, Sparkles } from 'lucide-react'

interface DiaryCoverLoginProps {
    onLoginSuccess: () => void
}

export function DiaryCoverLogin({ onLoginSuccess }: DiaryCoverLoginProps) {
    const [isSignup, setIsSignup] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [needsSetup, setNeedsSetup] = useState(false)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const res = await fetch('/api/auth/check')
            const data = await res.json()
            if (data.success) {
                setNeedsSetup(data.data.needsSetup)
                if (data.data.isAuthenticated) {
                    onLoginSuccess()
                }
            }
        } catch (err) {
            console.error('Auth check failed:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!username || username.trim().length < 2) {
            setError('Username must be at least 2 characters')
            return
        }

        if (password.length < 4) {
            setError('Password must be at least 4 characters')
            return
        }

        if (isSignup && password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    isSetup: needsSetup || isSignup,
                    username: username.trim()
                })
            })

            const data = await res.json()

            if (data.success) {
                onLoginSuccess()
            } else {
                setError(data.error || 'Authentication failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 flex items-center justify-center p-4">
            {/* Ambient light effects */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Diary Cover Container */}
            <div className="relative w-full max-w-5xl">
                <div className="relative perspective-1000">
                    {/* Main Diary Cover */}
                    <div className="relative bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                        }}>

                        {/* Leather texture overlay */}
                        <div className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                                backgroundSize: '100px 100px'
                            }}
                        />

                        {/* Stitching effect */}
                        <div className="absolute inset-4 border-2 border-amber-600/40 rounded-2xl"
                            style={{
                                borderStyle: 'dashed',
                                borderWidth: '2px'
                            }}
                        />

                        <div className="relative grid md:grid-cols-2 gap-8 p-12">
                            {/* Left Side - Diary Cover with Photo */}
                            <div className="flex flex-col items-center justify-center space-y-6">
                                {/* Photo Frame */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
                                    <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 p-3 rounded-2xl shadow-xl">
                                        {/* Photo placeholder - Replace with your photo */}
                                        <div className="w-64 h-64 bg-gradient-to-br from-amber-200 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-amber-300/50">
                                            {/* Placeholder - User should replace this */}
                                            <div className="text-center p-6">
                                                <User className="w-24 h-24 text-amber-700/40 mx-auto mb-4" strokeWidth={1.5} />
                                                <p className="text-amber-800/60 font-handwritten-alt text-sm">
                                                    Your Photo Here
                                                </p>
                                                <p className="text-amber-700/40 text-xs mt-2 font-handwritten-alt">
                                                    (Replace in code)
                                                </p>
                                            </div>
                                            {/* To add your photo, replace the div above with:
                                                <img src="/path/to/your/photo.jpg" alt="Your Name" className="w-full h-full object-cover" />
                                            */}
                                        </div>
                                    </div>
                                </div>

                                {/* Diary Title */}
                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-3">
                                        <BookOpen className="w-8 h-8 text-amber-200" strokeWidth={1.5} />
                                        <h1 className="text-5xl font-handwritten font-bold text-amber-100 drop-shadow-lg">
                                            My Diary
                                        </h1>
                                        <Sparkles className="w-6 h-6 text-amber-300 animate-twinkle" />
                                    </div>
                                    <p className="text-amber-200/80 font-handwritten-alt text-lg italic">
                                        A personal journey through time
                                    </p>
                                </div>

                                {/* Decorative elements */}
                                <div className="flex gap-4 text-amber-300/60">
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
                                    <span className="text-xl">✦</span>
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
                                </div>
                            </div>

                            {/* Right Side - Login/Signup Form */}
                            <div className="flex items-center justify-center">
                                <div className="w-full max-w-md">
                                    {/* Form Card */}
                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-amber-900/20">
                                        {/* Tab Toggle */}
                                        <div className="flex gap-2 mb-6 bg-amber-100/50 p-1 rounded-xl">
                                            <button
                                                onClick={() => setIsSignup(false)}
                                                className={`flex-1 py-3 rounded-lg font-handwritten-alt font-semibold transition-all ${!isSignup
                                                    ? 'bg-white text-amber-900 shadow-md'
                                                    : 'text-amber-700 hover:text-amber-900'
                                                    }`}
                                            >
                                                Login
                                            </button>
                                            <button
                                                onClick={() => setIsSignup(true)}
                                                className={`flex-1 py-3 rounded-lg font-handwritten-alt font-semibold transition-all ${isSignup
                                                    ? 'bg-white text-amber-900 shadow-md'
                                                    : 'text-amber-700 hover:text-amber-900'
                                                    }`}
                                            >
                                                Sign Up
                                            </button>
                                        </div>

                                        {/* Welcome Message */}
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-handwritten font-bold text-amber-900 mb-2">
                                                {isSignup ? 'Create Account' : 'Welcome Back'}
                                            </h2>
                                            <p className="text-amber-800/70 font-handwritten-alt text-sm">
                                                {isSignup ? 'Start your journaling journey' : 'Continue your story'}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Username (Always shown) */}
                                            <div>
                                                <label className="block text-amber-900 font-handwritten-alt font-semibold mb-2">
                                                    Username
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                                                    <input
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 font-handwritten-alt"
                                                        placeholder="Enter your username"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <label className="block text-amber-900 font-handwritten-alt font-semibold mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full pl-11 pr-12 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 font-handwritten-alt"
                                                        placeholder="Enter password"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700/60 hover:text-amber-700"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm Password (Signup only) */}
                                            {isSignup && (
                                                <div>
                                                    <label className="block text-amber-900 font-handwritten-alt font-semibold mb-2">
                                                        Confirm Password
                                                    </label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700/60" />
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="w-full pl-11 pr-4 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 font-handwritten-alt"
                                                            placeholder="Confirm password"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error Message */}
                                            {error && (
                                                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-3 text-red-700 font-handwritten-alt text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white px-6 py-4 rounded-xl hover:from-amber-600 hover:to-amber-600 transition-all font-handwritten-alt font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                        {isSignup ? 'Creating Account...' : 'Logging in...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-5 h-5" />
                                                        {isSignup ? 'Create Account' : 'Open Diary'}
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        {/* Footer Note */}
                                        <p className="text-center text-amber-800/60 text-xs mt-4 font-handwritten-alt italic">
                                            {isSignup
                                                ? 'Your thoughts, safely stored and encrypted'
                                                : 'Your personal space awaits'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Diary spine shadow effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/30 to-transparent rounded-l-3xl" />
                </div>
            </div>
        </div>
    )
}
