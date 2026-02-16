'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { X, CheckCircle2, Circle, Plus, Trash2, DollarSign, FileText, Loader2, Save } from 'lucide-react'
import { clsx } from 'clsx'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Todo = Database['public']['Tables']['todos']['Row']
type Expense = Database['public']['Tables']['expenses']['Row']
type Note = Database['public']['Tables']['notes']['Row']

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
            const [todosRes, expensesRes, notesRes] = await Promise.all([
                supabase.from('todos').select('*').eq('date', dateStr).order('created_at', { ascending: true }),
                supabase.from('expenses').select('*').eq('date', dateStr).order('created_at', { ascending: true }),
                supabase.from('notes').select('*').eq('date', dateStr).maybeSingle()
            ])

            if (todosRes.data) setTodos(todosRes.data)
            if (expensesRes.data) setExpenses(expensesRes.data)
            if (notesRes.data) {
                setNote(notesRes.data)
                setNoteContent(notesRes.data.content)
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
        const { data, error } = await supabase.from('todos').insert({
            title: newTodoTitle,
            date: dateStr,
            status: false
        }).select().single()

        if (data && !error) {
            setTodos([...todos, data])
            setNewTodoTitle('')
        }
    }

    const handleToggleTodo = async (todo: Todo) => {
        const { error } = await supabase.from('todos').update({ status: !todo.status }).eq('id', todo.id)
        if (!error) {
            setTodos(todos.map(t => t.id === todo.id ? { ...t, status: !t.status } : t))
        }
    }

    const handleDeleteTodo = async (id: string) => {
        const { error } = await supabase.from('todos').delete().eq('id', id)
        if (!error) {
            setTodos(todos.filter(t => t.id !== id))
        }
    }

    const handleAddExpense = async () => {
        const amount = parseFloat(newExpenseAmount)
        if (!amount || !newExpenseCategory.trim()) return

        const { data, error } = await supabase.from('expenses').insert({
            amount,
            category: newExpenseCategory,
            date: dateStr
        }).select().single()

        if (data && !error) {
            setExpenses([...expenses, data])
            setNewExpenseAmount('')
            setNewExpenseCategory('')
        }
    }

    const handleDeleteExpense = async (id: string) => {
        const { error } = await supabase.from('expenses').delete().eq('id', id)
        if (!error) {
            setExpenses(expenses.filter(e => e.id !== id))
        }
    }

    const handleSaveNote = async () => {
        if (note) {
            const { data, error } = await supabase.from('notes').update({
                content: noteContent,
                updated_at: new Date().toISOString()
            }).eq('id', note.id).select().single()
            if (data && !error) setNote(data)
        } else {
            const { data, error } = await supabase.from('notes').insert({
                date: dateStr,
                content: noteContent
            }).select().single()
            if (data && !error) setNote(data)
        }
    }

    if (!date) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold">{format(date, 'EEEE')}</h2>
                        <p className="text-indigo-100">{format(date, 'MMMM do, yyyy')}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 shrink-0">
                    {(['todos', 'expenses', 'notes'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 capitalize",
                                activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {tab === 'todos' && <CheckCircle2 className="w-4 h-4" />}
                            {tab === 'expenses' && <DollarSign className="w-4 h-4" />}
                            {tab === 'notes' && <FileText className="w-4 h-4" />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'todos' && (
                                <div className="space-y-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTodoTitle}
                                            onChange={(e) => setNewTodoTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                                            placeholder="Add a new task..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-50 transition-all font-sans"
                                        />
                                        <button
                                            onClick={handleAddTodo}
                                            disabled={!newTodoTitle.trim()}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {todos.length === 0 && <p className="text-center text-gray-400 py-4">No tasks yet.</p>}
                                        {todos.map(todo => (
                                            <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                                                <button
                                                    onClick={() => handleToggleTodo(todo)}
                                                    className={clsx(
                                                        "transition-colors",
                                                        todo.status ? "text-indigo-600" : "text-gray-400 hover:text-indigo-600"
                                                    )}
                                                >
                                                    {todo.status ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                                </button>
                                                <span className={clsx("flex-1 text-gray-700 font-sans", todo.status && "line-through text-gray-400")}>
                                                    {todo.title}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'expenses' && (
                                <div className="space-y-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={newExpenseAmount}
                                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                                            placeholder="Amount"
                                            className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-50 transition-all font-sans"
                                        />
                                        <input
                                            type="text"
                                            value={newExpenseCategory}
                                            onChange={(e) => setNewExpenseCategory(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                                            placeholder="Category (e.g. Food)"
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-50 transition-all font-sans"
                                        />
                                        <button
                                            onClick={handleAddExpense}
                                            disabled={!newExpenseAmount || !newExpenseCategory.trim()}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {expenses.length === 0 && <p className="text-center text-gray-400 py-4">No expenses yet.</p>}
                                        {expenses.map(expense => (
                                            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800 font-sans">{expense.category}</span>
                                                    <span className="text-xs text-gray-50">
                                                        {expense.note && ` - ${expense.note}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-gray-900">${expense.amount.toFixed(2)}</span>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {expenses.length > 0 && (
                                            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl mt-4">
                                                <span className="font-medium text-indigo-900">Total</span>
                                                <span className="font-bold text-2xl text-indigo-700">
                                                    ${expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
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
                                        className="w-full flex-1 min-h-[300px] p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans text-gray-700 leading-relaxed bg-gray-50 focus:bg-white transition-colors"
                                        placeholder="Write your thoughts for the day..."
                                    />
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={handleSaveNote}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" /> Save Note
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
