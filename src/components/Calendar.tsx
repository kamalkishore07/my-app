'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns'
import { ChevronLeft, ChevronRight, CheckCircle2, DollarSign, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '@/lib/supabase'

interface CalendarProps {
    onDateClick: (date: Date) => void
}

type DailyStats = {
    date: string
    hasTodos: boolean
    hasExpenses: boolean
    hasNotes: boolean
}

export function Calendar({ onDateClick }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [stats, setStats] = useState<Record<string, DailyStats>>({})

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    // Fetch stats for the current month view
    const fetchStats = useCallback(async () => {
        const startStr = format(startDate, 'yyyy-MM-dd')
        const endStr = format(endDate, 'yyyy-MM-dd')

        const [todos, expenses, notes] = await Promise.all([
            supabase.from('todos').select('date').gte('date', startStr).lte('date', endStr),
            supabase.from('expenses').select('date').gte('date', startStr).lte('date', endStr),
            supabase.from('notes').select('date').gte('date', startStr).lte('date', endStr)
        ])

        const newStats: Record<string, DailyStats> = {}

        todos.data?.forEach(t => {
            if (!newStats[t.date]) newStats[t.date] = { date: t.date, hasTodos: false, hasExpenses: false, hasNotes: false }
            newStats[t.date].hasTodos = true
        })

        expenses.data?.forEach(e => {
            if (!newStats[e.date]) newStats[e.date] = { date: e.date, hasTodos: false, hasExpenses: false, hasNotes: false }
            newStats[e.date].hasExpenses = true
        })

        notes.data?.forEach(n => {
            if (!newStats[n.date]) newStats[n.date] = { date: n.date, hasTodos: false, hasExpenses: false, hasNotes: false }
            newStats[n.date].hasNotes = true
        })

        setStats(newStats)
    }, [startDate, endDate])

    useEffect(() => {
        fetchStats()
    }, [fetchStats, currentMonth]) // currentMonth triggers recalc of start/end dates

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-400 uppercase text-sm tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
                {calendarDays.map((day, dayIdx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart)
                    const isCurrentDay = isToday(day)
                    const dayStr = format(day, 'yyyy-MM-dd')
                    const dayStats = stats[dayStr]

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onDateClick(day)}
                            className={twMerge(
                                "aspect-square relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 group hover:shadow-lg border border-transparent",
                                !isCurrentMonth && "text-gray-300 bg-gray-50/50",
                                isCurrentMonth && "bg-white hover:border-indigo-200 hover:bg-indigo-50/30",
                                isCurrentDay && "bg-indigo-600 text-white shadow-indigo-200 shadow-lg hover:bg-indigo-700"
                            )}
                        >
                            <span className={clsx(
                                "text-lg font-medium",
                                !isCurrentMonth && "text-gray-300",
                                isCurrentDay && "text-white"
                            )}>
                                {format(day, 'd')}
                            </span>

                            {/* Event Indicators */}
                            <div className="flex gap-1 mt-1 h-2">
                                {dayStats?.hasTodos && (
                                    <div className={clsx("w-1.5 h-1.5 rounded-full", isCurrentDay ? "bg-white" : "bg-emerald-400")} />
                                )}
                                {dayStats?.hasExpenses && (
                                    <div className={clsx("w-1.5 h-1.5 rounded-full", isCurrentDay ? "bg-white" : "bg-amber-400")} />
                                )}
                                {dayStats?.hasNotes && (
                                    <div className={clsx("w-1.5 h-1.5 rounded-full", isCurrentDay ? "bg-white" : "bg-blue-400")} />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
