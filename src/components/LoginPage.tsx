'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Feather, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

interface LoginPageProps {
    onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSetup, setIsSetup] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const res = await fetch('/api/auth/check')
            const data = await res.json()
            if (data.success) {
                setIsSetup(data.data.needsSetup)
                if (data.data.isAuthenticated) {
                    onLoginSuccess()
                }
            }
        } catch (err) {
            console.error('Auth check failed:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 4) {
            setError('Password must be at least 4 characters')
            return
        }

        if (isSetup && password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, isSetup })
            })

            const data = await res.json()

            if (data.success) {
                onLoginSuccess()
            } else {
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 opacity-20 rotate-45 animate-float">
                <Feather className="w-24 h-24 text-amber-900" strokeWidth={1} />
            </div>
            <div className="absolute bottom-20 right-16 opacity-20 animate-sway">
                <BookOpen className="w-20 h-20 text-amber-800" strokeWidth={1.5} />
            </div>
            <div className="absolute top-1/4 right-1/4 opacity-40 animate-twinkle">
                <Sparkles className="w-6 h-6 text-amber-700" />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Lock className="w-10 h-10 text-amber-800 opacity-70" strokeWidth={1.5} />
                            <h1 className="text-6xl font-handwritten font-bold text-amber-900">
                                Kamal's Diary
                            </h1>
                        </div>
                        <p className="text-amber-800/80 text-lg font-handwritten-alt">
                            {isSetup ? 'Create your password to get started' : 'Welcome back! Enter your password'}
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-amber-900/20 animate-slide-up">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isSetup && (
                                <div className="bg-amber-100/60 border-2 border-amber-700/30 rounded-xl p-4 mb-6">
                                    <p className="text-amber-900 font-handwritten-alt text-sm">
                                        ✨ First time setup! Create a password to secure your diary.
                                    </p>
                                </div>
                            )}

                            {/* Password Input */}
                            <div>
                                <label className="block text-amber-900 font-handwritten-alt font-semibold mb-2 text-lg">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 font-handwritten-alt text-lg pr-12"
                                        placeholder="Enter your password"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700/60 hover:text-amber-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (Setup only) */}
                            {isSetup && (
                                <div>
                                    <label className="block text-amber-900 font-handwritten-alt font-semibold mb-2 text-lg">
                                        Confirm Password
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-5 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 font-handwritten-alt text-lg"
                                        placeholder="Confirm your password"
                                        required
                                    />
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
                                className="w-full bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white px-6 py-4 rounded-xl hover:from-amber-600 hover:to-amber-600 transition-all font-handwritten-alt font-bold text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        {isSetup ? 'Creating Account...' : 'Logging in...'}
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        {isSetup ? 'Create Account' : 'Login'}
                                    </>
                                )}
                            </button>

                            {/* Helper Text */}
                            <p className="text-center text-amber-800/60 text-sm font-handwritten-alt italic">
                                {isSetup
                                    ? 'Remember this password - you\'ll need it to access your diary!'
                                    : 'Your personal space, protected and private'}
                            </p>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-amber-800/50 text-sm font-handwritten-alt">
                            Secured with password protection 🔒
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
