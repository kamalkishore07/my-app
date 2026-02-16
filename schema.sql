-- Create tables for the Calendar App

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- TODOS Table
create table todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  status boolean default false,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EXPENSES Table
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  amount numeric not null,
  category text not null,
  date date not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTES Table
create table notes (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  content text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_todos_date on todos(date);
create index idx_expenses_date on expenses(date);
create index idx_notes_date on notes(date);
