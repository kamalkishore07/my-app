'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { X, CheckCircle2, Circle, Plus, Trash2, DollarSign, FileText, Loader2, Save, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'

type Todo = {
    id: string
    title: string
    description: string | null
    date: string
    status: boolean
    priority: 'low' | 'medium' | 'high'
    created_at: string
}

type Expense = {
    id: string
    amount: number
    category: string
    date: string
    note: string | null
    created_at: string
}

type Note = {
    id: string
    date: string
    content: string
    updated_at: string
}

interface DayViewProps {
    date: Date | null
    onClose: () => void
}

export function DayView({ date, onClose }: DayViewProps) {
    const [activeTab, setActiveTab] = useState<'todos' | 'expenses' | 'notes'>('todos')
    const [loading, setLoading] = useState(true)
    const [todos, setTodos] = useState<Todo[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [note, setNote] = useState<Note | null>(null)
    const [noteContent, setNoteContent] = useState('')

    // Form states
    const [newTodoTitle, setNewTodoTitle] = useState('')
    const [newExpenseAmount, setNewExpenseAmount] = useState('')
    const [newExpenseCategory, setNewExpenseCategory] = useState('')

    const dateStr = date ? format(date, 'yyyy-MM-dd') : ''

    const fetchData = useCallback(async () => {
        if (!dateStr) return
        setLoading(true)
        try {
            const [todosRes, expensesRes, noteRes] = await Promise.all([
                fetch(`/api/todos?date=${dateStr}`),
                fetch(`/api/expenses?date=${dateStr}`),
                fetch(`/api/notes?date=${dateStr}`)
            ])

            const todosData = await todosRes.json()
            const expensesData = await expensesRes.json()
            const noteData = await noteRes.json()

            // Handle new API response format {success, data}
            const todos = todosData.success ? todosData.data : todosData
            const expenses = expensesData.success ? expensesData.data : expensesData
            const note = noteData.success ? noteData.data : noteData

            setTodos(Array.isArray(todos) ? todos.map((t: any) => ({ ...t, id: t._id })) : [])
            setExpenses(Array.isArray(expenses) ? expenses.map((e: any) => ({ ...e, id: e._id })) : [])
            if (note && note !== null) {
                setNote({ ...note, id: note._id })
                setNoteContent(note.content)
            } else {
                setNote(null)
                setNoteContent('')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }, [dateStr])

    useEffect(() => {
        if (date) fetchData()
    }, [date, fetchData])

    const handleAddTodo = async () => {
        if (!newTodoTitle.trim()) return
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTodoTitle,
                    date: dateStr,
                    status: false,
                    priority: 'medium'
                })
            })
            const result = await res.json()
            const newTodo = result.success ? result.data : result
            setTodos([...todos, { ...newTodo, id: newTodo._id }])
            setNewTodoTitle('')
        } catch (error) {
            console.error('Error adding todo:', error)
        }
    }

    const handleToggleTodo = async (todo: Todo) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: todo.id, status: !todo.status })
            })
            const result = await res.json()
            const updated = result.success ? result.data : result
            setTodos(todos.map(t => t.id === todo.id ? { ...updated, id: updated._id } : t))
        } catch (error) {
            console.error('Error toggling todo:', error)
        }
    }

    const handleDeleteTodo = async (id: string) => {
        try {
            await fetch(`/api/todos?id=${id}`, { method: 'DELETE' })
            setTodos(todos.filter(t => t.id !== id))
        } catch (error) {
            console.error('Error deleting todo:', error)
        }
    }

    const handleAddExpense = async () => {
        const amount = parseFloat(newExpenseAmount)
        if (!amount || !newExpenseCategory.trim()) return

        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    category: newExpenseCategory,
                    date: dateStr
                })
            })
            const result = await res.json()
            const newExpense = result.success ? result.data : result
            setExpenses([...expenses, { ...newExpense, id: newExpense._id }])
            setNewExpenseAmount('')
            setNewExpenseCategory('')
        } catch (error) {
            console.error('Error adding expense:', error)
        }
    }

    const handleDeleteExpense = async (id: string) => {
        try {
            await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
            setExpenses(expenses.filter(e => e.id !== id))
        } catch (error) {
            console.error('Error deleting expense:', error)
        }
    }

    const handleSaveNote = async () => {
        if (!noteContent.trim()) return
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateStr, content: noteContent })
            })
            const result = await res.json()
            const savedNote = result.success ? result.data : result
            setNote({ ...savedNote, id: savedNote._id })
        } catch (error) {
            console.error('Error saving note:', error)
        }
    }

    if (!date) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-[#fdfbf7] via-[#faf8f3] to-[#f8f6f0] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-page-turn flex flex-col max-h-[90vh] border-4 border-amber-900/20 relative">

                {/* Paper texture overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
                    }}
                />

                {/* Decorative butterfly in corner */}
                <div className="absolute top-6 right-6 opacity-20 animate-butterfly-1 pointer-events-none">
                    <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 20C18 15 12 12 8 14C4 16 3 22 6 26C9 30 15 28 18 24M20 20C22 15 28 12 32 14C36 16 37 22 34 26C31 30 25 28 22 24M20 20V32"
                            stroke="#8B4513" strokeWidth="1.5" fill="#D4A574" fillOpacity="0.3" />
                    </svg>
                </div>

                {/* Header */}
                <div className="relative bg-gradient-to-r from-amber-100/80 via-amber-50/80 to-amber-100/80 p-8 border-b-2 border-amber-900/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-5xl font-handwritten font-bold text-amber-900 mb-2">
                                {format(date, 'EEEE')}
                            </h2>
                            <p className="text-2xl font-handwritten-alt text-amber-800/80">
                                {format(date, 'MMMM do, yyyy')}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-200 border-2 border-amber-900/10 group hover:scale-110"
                        >
                            <X className="w-6 h-6 text-amber-900/70 group-hover:text-amber-900" strokeWidth={2.5} />
                        </button>
                    </div>
                    <Sparkles className="absolute top-4 right-20 w-6 h-6 text-amber-700/30 animate-twinkle" />
                </div>

                {/* Tabs */}
                <div className="relative flex border-b-2 border-amber-900/10 bg-amber-50/30">
                    {(['todos', 'expenses', 'notes'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "flex-1 py-5 text-lg font-handwritten-alt font-semibold transition-all flex items-center justify-center gap-2 capitalize relative",
                                activeTab === tab
                                    ? "text-amber-900 bg-white/60"
                                    : "text-amber-800/50 hover:text-amber-800/80 hover:bg-white/30"
                            )}
                        >
                            {tab === 'todos' && <CheckCircle2 className="w-5 h-5" strokeWidth={2} />}
                            {tab === 'expenses' && <DollarSign className="w-5 h-5" strokeWidth={2} />}
                            {tab === 'notes' && <FileText className="w-5 h-5" strokeWidth={2} />}
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="relative p-8 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'todos' && (
                                <div className="space-y-6">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newTodoTitle}
                                            onChange={(e) => setNewTodoTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                                            placeholder="Add a new task..."
                                            className="flex-1 px-5 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 placeholder-amber-800/40 font-handwritten-alt text-lg"
                                        />
                                        <button
                                            onClick={handleAddTodo}
                                            disabled={!newTodoTitle.trim()}
                                            className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-600 transition-all flex items-center gap-2 font-handwritten-alt font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                        >
                                            <Plus className="w-5 h-5" /> Add
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {todos.length === 0 && (
                                            <p className="text-center text-amber-800/50 py-8 text-lg font-handwritten-alt italic">
                                                No tasks yet. Start your day fresh!
                                            </p>
                                        )}
                                        {todos.map(todo => (
                                            <div key={todo.id} className="flex items-center gap-4 p-4 bg-white/70 rounded-xl group hover:bg-white/90 transition-all border-2 border-amber-900/10 hover:border-amber-700/20 shadow-sm">
                                                <button
                                                    onClick={() => handleToggleTodo(todo)}
                                                    className={clsx(
                                                        "transition-all",
                                                        todo.status ? "text-amber-700" : "text-amber-900/30 hover:text-amber-700"
                                                    )}
                                                >
                                                    {todo.status ? <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} /> : <Circle className="w-6 h-6" strokeWidth={2} />}
                                                </button>
                                                <span className={clsx("flex-1 text-amber-900 font-handwritten-alt text-lg", todo.status && "line-through text-amber-900/40")}>
                                                    {todo.title}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-700/70 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'expenses' && (
                                <div className="space-y-6">
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            value={newExpenseAmount}
                                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                                            placeholder="₹"
                                            className="w-28 px-5 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 placeholder-amber-800/40 font-handwritten-alt text-lg"
                                        />
                                        <input
                                            type="text"
                                            value={newExpenseCategory}
                                            onChange={(e) => setNewExpenseCategory(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                                            placeholder="Category (e.g. Coffee)"
                                            className="flex-1 px-5 py-3 bg-white/80 border-2 border-amber-900/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 transition-all text-amber-900 placeholder-amber-800/40 font-handwritten-alt text-lg"
                                        />
                                        <button
                                            onClick={handleAddExpense}
                                            disabled={!newExpenseAmount || !newExpenseCategory.trim()}
                                            className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-600 transition-all flex items-center gap-2 font-handwritten-alt font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                        >
                                            <Plus className="w-5 h-5" /> Add
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {expenses.length === 0 && (
                                            <p className="text-center text-amber-800/50 py-8 text-lg font-handwritten-alt italic">
                                                No expenses tracked yet
                                            </p>
                                        )}
                                        {expenses.map(expense => (
                                            <div key={expense.id} className="flex items-center justify-between p-4 bg-white/70 rounded-xl group hover:bg-white/90 transition-all border-2 border-amber-900/10 hover:border-amber-700/20 shadow-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-amber-900 text-xl font-handwritten">{expense.category}</span>
                                                    {expense.note && <span className="text-sm text-amber-800/60 font-handwritten-alt">{expense.note}</span>}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-2xl text-amber-700 font-handwritten">₹{expense.amount.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-red-700/70 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {expenses.length > 0 && (
                                            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-amber-100/80 to-amber-50/80 rounded-2xl mt-6 border-2 border-amber-700/20 shadow-md">
                                                <span className="font-bold text-amber-900 text-2xl font-handwritten">Total</span>
                                                <span className="font-black text-4xl text-amber-700 font-handwritten">
                                                    ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="h-full flex flex-col">
                                    <textarea
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        className="w-full flex-1 min-h-[300px] p-5 bg-white/70 border-2 border-amber-900/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700/40 text-amber-900 leading-relaxed placeholder-amber-800/40 transition-all font-handwritten-alt text-lg"
                                        placeholder="Dear diary, today I..."
                                        style={{
                                            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139, 69, 19, 0.1) 31px, rgba(139, 69, 19, 0.1) 32px)',
                                            lineHeight: '32px',
                                            paddingTop: '8px'
                                        }}
                                    />
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={handleSaveNote}
                                            className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-amber-600 transition-all flex items-center gap-2 font-handwritten-alt font-bold text-lg shadow-lg"
                                        >
                                            <Save className="w-5 h-5" /> Save Entry
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
