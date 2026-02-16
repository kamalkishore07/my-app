'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/Calendar'
import { DayView } from '@/components/DayView'
import { DiaryCoverLogin } from '@/components/DiaryCoverLogin'
import { BookOpen, Feather, Flower2, Sparkles, LogOut } from 'lucide-react'

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string>('User')

  useEffect(() => {
    checkAuth()

    // Auto-refresh token every 10 minutes
    const refreshInterval = setInterval(async () => {
      try {
        await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        })
      } catch (err) {
        console.error('Token refresh failed:', err)
      }
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success && data.data.isAuthenticated) {
        setIsAuthenticated(true)
        setUsername(data.data.username || 'User')
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setIsAuthenticated(false)
      setSelectedDate(null)
      setUsername('User')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <DiaryCoverLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-amber-900/5" />

      {/* Floating decorative elements */}
      {/* Pen decoration - top left */}
      <div className="absolute top-20 left-10 opacity-20 rotate-45 animate-float">
        <Feather className="w-24 h-24 text-amber-900" strokeWidth={1} />
      </div>

      {/* Butterfly 1 - top right */}
      <div className="absolute top-32 right-20 opacity-30 animate-butterfly-1">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20C18 15 12 12 8 14C4 16 3 22 6 26C9 30 15 28 18 24M20 20C22 15 28 12 32 14C36 16 37 22 34 26C31 30 25 28 22 24M20 20V32"
            stroke="#8B4513" strokeWidth="1.5" fill="#D4A574" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Butterfly 2 - middle right */}
      <div className="absolute top-1/2 right-10 opacity-25 animate-butterfly-2">
        <svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20C18 15 12 12 8 14C4 16 3 22 6 26C9 30 15 28 18 24M20 20C22 15 28 12 32 14C36 16 37 22 34 26C31 30 25 28 22 24M20 20V32"
            stroke="#8B4513" strokeWidth="1.5" fill="#D4A574" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Flower decoration - bottom left */}
      <div className="absolute bottom-32 left-16 opacity-20 animate-sway">
        <Flower2 className="w-20 h-20 text-amber-800" strokeWidth={1.5} />
      </div>

      {/* Small sparkles scattered */}
      <div className="absolute top-1/4 left-1/4 opacity-40 animate-twinkle">
        <Sparkles className="w-6 h-6 text-amber-700" />
      </div>
      <div className="absolute top-2/3 right-1/3 opacity-30 animate-twinkle-delayed">
        <Sparkles className="w-5 h-5 text-amber-700" />
      </div>

      {/* Ink splatter decoration - bottom right */}
      <div className="absolute bottom-20 right-24 w-16 h-16 rounded-full bg-amber-900/5 blur-xl" />
      <div className="absolute bottom-24 right-20 w-8 h-8 rounded-full bg-amber-900/10 blur-md" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header - Diary Style */}
        <div className="text-center mb-8 space-y-3 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Feather className="w-8 h-8 text-amber-800 opacity-70 animate-pen-wiggle" strokeWidth={1.5} />
            <h1 className="text-5xl font-handwritten font-bold tracking-tight text-amber-900">
              {username}'s Diary
            </h1>
            <BookOpen className="w-8 h-8 text-amber-800 opacity-70 animate-book-open" strokeWidth={1.5} />
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-amber-800/80 text-lg font-handwritten-alt leading-relaxed">
              A personal space to capture your thoughts, track your journey, and organize your days
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
              <span className="text-amber-700/50 text-sm font-casual">✦</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white/60 hover:bg-white/90 border-2 border-amber-900/20 rounded-full transition-all text-amber-900 font-handwritten-alt shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="animate-slide-up">
          <Calendar onDateClick={setSelectedDate} />
        </div>

        {selectedDate && (
          <DayView
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>
    </main>
  );
}

