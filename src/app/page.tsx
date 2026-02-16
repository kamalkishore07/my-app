'use client'

import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { DayView } from '@/components/DayView'

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Life Organizer
          </h1>
          <p className="text-gray-500">Manage your tasks, expenses, and notes in one place.</p>
        </div>

        <Calendar onDateClick={setSelectedDate} />

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
