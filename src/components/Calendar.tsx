'use client'

import React, { useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addMonths,
    subMonths,
    isToday
} from 'date-fns'
import { ChevronLeft, ChevronRight, Coffee } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface CalendarProps {
    onDateClick: (date: Date) => void
}

export function Calendar({ onDateClick }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

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

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Diary Page Container */}
            <div className="relative">
                {/* Leather binding effect on left */}
                <div className="absolute -left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-l-lg shadow-xl">
                    <div className="h-full flex flex-col justify-evenly px-1">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-1 w-full bg-amber-950/30 rounded" />
                        ))}
                    </div>
                </div>

                {/* Main diary page */}
                <div className="bg-gradient-to-br from-[#fdfbf7] via-[#faf8f3] to-[#f8f6f0] rounded-2xl shadow-2xl border-4 border-amber-900/20 overflow-hidden relative">
                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
                        }}
                    />

                    {/* Spiral binding holes on left */}
                    <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly py-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-amber-900/10 border-2 border-amber-900/20" />
                        ))}
                    </div>

                    {/* Header */}
                    <div className="relative border-b-2 border-amber-900/10 px-8 py-4 bg-gradient-to-b from-amber-50/50 to-transparent">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onPrevMonth}
                                className="p-2 rounded-full hover:bg-amber-100/50 transition-all duration-200 group"
                            >
                                <ChevronLeft className="w-6 h-6 text-amber-900/70 group-hover:text-amber-900" strokeWidth={2.5} />
                            </button>

                            <div className="text-center">
                                <h2 className="text-3xl font-handwritten font-bold text-amber-900 mb-0">
                                    {format(currentMonth, 'MMMM')}
                                </h2>
                                <p className="text-lg font-handwritten-alt text-amber-800/70">
                                    {format(currentMonth, 'yyyy')}
                                </p>
                            </div>

                            <button
                                onClick={onNextMonth}
                                className="p-2 rounded-full hover:bg-amber-100/50 transition-all duration-200 group"
                            >
                                <ChevronRight className="w-6 h-6 text-amber-900/70 group-hover:text-amber-900" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Decorative coffee stain */}
                        <div className="absolute top-2 right-8 w-12 h-12 rounded-full bg-amber-900/5 blur-sm" />
                    </div>

                    <div className="p-6 pl-16">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                <div key={day} className="text-center py-1">
                                    <span className="text-xs font-handwritten-alt font-semibold text-amber-900/60 tracking-wide">
                                        {day.slice(0, 3)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day) => {
                                const isCurrentMonth = isSameMonth(day, monthStart)
                                const isCurrentDay = isToday(day)

                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => onDateClick(day)}
                                        className={twMerge(
                                            "aspect-square relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 group border-2",
                                            !isCurrentMonth && "text-amber-900/20 bg-amber-50/30 border-transparent",
                                            isCurrentMonth && !isCurrentDay && "bg-white/60 border-amber-900/10 hover:border-amber-700/30 hover:bg-amber-50/80 text-amber-900 hover:shadow-lg",
                                            isCurrentDay && "bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 border-amber-800 text-white shadow-xl hover:shadow-2xl hover:scale-105"
                                        )}
                                    >
                                        <span className={clsx(
                                            "text-2xl font-handwritten font-bold transition-all",
                                            !isCurrentMonth && "text-amber-900/20",
                                            isCurrentMonth && !isCurrentDay && "text-amber-900 group-hover:text-amber-800",
                                            isCurrentDay && "text-white drop-shadow-lg"
                                        )}>
                                            {format(day, 'd')}
                                        </span>

                                        {/* Subtle paper fold effect on hover */}
                                        {isCurrentMonth && !isCurrentDay && (
                                            <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-t-transparent border-r-amber-900/0 group-hover:border-r-amber-900/10 transition-all rounded-tr-xl" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Page shadow */}
                <div className="absolute -bottom-2 left-2 right-2 h-4 bg-amber-900/10 blur-md rounded-b-2xl -z-10" />
            </div>
        </div>
    )
}
