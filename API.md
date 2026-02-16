# API Documentation

Complete API reference for Kamal's Diary application.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-app.vercel.app/api`

## Response Format

All API responses follow a standardized format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

---

## Todos API

### Get Todos

Fetch all todos for a specific date.

**Endpoint**: `GET /api/todos?date={YYYY-MM-DD}`

**Query Parameters**:
- `date` (required): Date in YYYY-MM-DD format

**Example Request**:
```bash
curl http://localhost:3000/api/todos?date=2026-02-16
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Complete project",
      "description": "Finish the diary app",
      "date": "2026-02-16",
      "status": false,
      "priority": "high",
      "createdAt": "2026-02-16T10:30:00.000Z"
    }
  ]
}
```

### Create Todo

Create a new todo item.

**Endpoint**: `POST /api/todos`

**Request Body**:
```json
{
  "title": "Complete project",
  "description": "Finish the diary app",
  "date": "2026-02-16",
  "status": false,
  "priority": "high"
}
```

**Required Fields**: `title`, `date`

**Optional Fields**: `description`, `status` (default: false), `priority` (default: "medium")

**Priority Values**: `"low"`, `"medium"`, `"high"`

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Complete project",
    "description": "Finish the diary app",
    "date": "2026-02-16",
    "status": false,
    "priority": "high",
    "createdAt": "2026-02-16T10:30:00.000Z"
  }
}
```

### Update Todo

Update an existing todo (partial update supported).

**Endpoint**: `PATCH /api/todos`

**Request Body**:
```json
{
  "id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "status": true,
  "priority": "low"
}
```

**Required Fields**: `id`

**Optional Fields**: `title`, `description`, `status`, `priority`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Complete project",
    "description": "Finish the diary app",
    "date": "2026-02-16",
    "status": true,
    "priority": "low",
    "createdAt": "2026-02-16T10:30:00.000Z"
  }
}
```

### Delete Todo

Delete a todo item.

**Endpoint**: `DELETE /api/todos?id={todo_id}`

**Query Parameters**:
- `id` (required): MongoDB ObjectId of the todo

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Todo deleted successfully",
    "deletedTodo": { /* deleted todo object */ }
  }
}
```

---

## Expenses API

### Get Expenses

Fetch all expenses for a specific date.

**Endpoint**: `GET /api/expenses?date={YYYY-MM-DD}`

**Example Request**:
```bash
curl http://localhost:3000/api/expenses?date=2026-02-16
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "amount": 50.75,
      "category": "Food",
      "date": "2026-02-16",
      "note": "Lunch at restaurant",
      "createdAt": "2026-02-16T12:00:00.000Z"
    }
  ]
}
```

### Create Expense

Create a new expense entry.

**Endpoint**: `POST /api/expenses`

**Request Body**:
```json
{
  "amount": 50.75,
  "category": "Food",
  "date": "2026-02-16",
  "note": "Lunch at restaurant"
}
```

**Required Fields**: `amount`, `category`, `date`

**Optional Fields**: `note`

**Validation**: `amount` must be a positive number

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "amount": 50.75,
    "category": "Food",
    "date": "2026-02-16",
    "note": "Lunch at restaurant",
    "createdAt": "2026-02-16T12:00:00.000Z"
  }
}
```

### Update Expense

Update an existing expense.

**Endpoint**: `PATCH /api/expenses`

**Request Body**:
```json
{
  "id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "amount": 45.50,
  "note": "Updated note"
}
```

**Required Fields**: `id`

**Optional Fields**: `amount`, `category`, `note`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "amount": 45.50,
    "category": "Food",
    "date": "2026-02-16",
    "note": "Updated note",
    "createdAt": "2026-02-16T12:00:00.000Z"
  }
}
```

### Delete Expense

Delete an expense entry.

**Endpoint**: `DELETE /api/expenses?id={expense_id}`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Expense deleted successfully",
    "deletedExpense": { /* deleted expense object */ }
  }
}
```

---

## Notes API

### Get Note

Fetch note for a specific date (one note per day).

**Endpoint**: `GET /api/notes?date={YYYY-MM-DD}`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "date": "2026-02-16",
    "content": "Today was a productive day...",
    "updatedAt": "2026-02-16T20:00:00.000Z"
  }
}
```

**Note**: Returns `null` if no note exists for the date.

### Create/Update Note

Create a new note or update existing note for a date.

**Endpoint**: `POST /api/notes`

**Request Body**:
```json
{
  "date": "2026-02-16",
  "content": "Today was a productive day..."
}
```

**Required Fields**: `date`, `content`

**Behavior**: Uses upsert - creates if doesn't exist, updates if exists

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "date": "2026-02-16",
    "content": "Today was a productive day...",
    "updatedAt": "2026-02-16T20:00:00.000Z"
  }
}
```

### Update Note

Update an existing note.

**Endpoint**: `PATCH /api/notes`

**Request Body**:
```json
{
  "date": "2026-02-16",
  "content": "Updated content..."
}
```

**Required Fields**: `date`, `content`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "date": "2026-02-16",
    "content": "Updated content...",
    "updatedAt": "2026-02-16T21:00:00.000Z"
  }
}
```

### Delete Note

Delete a note for a specific date.

**Endpoint**: `DELETE /api/notes?date={YYYY-MM-DD}`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Note deleted successfully",
    "deletedNote": { /* deleted note object */ }
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Common Error Responses

### Missing Required Fields (400)
```json
{
  "success": false,
  "error": "Missing required fields: title, date"
}
```

### Invalid Date Format (400)
```json
{
  "success": false,
  "error": "Invalid date format. Use YYYY-MM-DD"
}
```

### Invalid ID Format (400)
```json
{
  "success": false,
  "error": "Invalid todo ID format"
}
```

### Resource Not Found (404)
```json
{
  "success": false,
  "error": "Todo not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to fetch todos"
}
```

---

## Testing with cURL

### Create a Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","date":"2026-02-16","priority":"high"}'
```

### Get Todos
```bash
curl http://localhost:3000/api/todos?date=2026-02-16
```

### Update Todo
```bash
curl -X PATCH http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"id":"YOUR_TODO_ID","status":true}'
```

### Delete Todo
```bash
curl -X DELETE "http://localhost:3000/api/todos?id=YOUR_TODO_ID"
```
