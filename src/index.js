const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory array to act as a database
let expenses = [];
let nextId = 1;

// CREATE (POST) a new expense
app.post('/api/expenses', (req, res) => {
    const { amount, category, date, description } = req.body;

    // Basic validation
    if (amount === undefined || category === undefined || date === undefined || description === undefined) {
        return res.status(400).json({ error: 'Missing required fields: amount, category, date, description' });
    }

    if (typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount must be a number' });
    }

    const newExpense = {
        id: nextId++,
        amount,
        category: String(category),
        date: String(date),
        description: String(description)
    };

    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

// READ (GET) all expenses
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

// READ (GET) a specific expense by ID
app.get('/api/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const expense = expenses.find(e => e.id === id);

    if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
});

// UPDATE (PUT) an expense by ID
app.put('/api/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { amount, category, date, description } = req.body;

    const expenseIndex = expenses.findIndex(e => e.id === id);

    if (expenseIndex === -1) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    if (amount !== undefined && typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount must be a number' });
    }

    // Update fields if provided
    const updatedExpense = { ...expenses[expenseIndex] };
    if (amount !== undefined) updatedExpense.amount = amount;
    if (category !== undefined) updatedExpense.category = String(category);
    if (date !== undefined) updatedExpense.date = String(date);
    if (description !== undefined) updatedExpense.description = String(description);

    expenses[expenseIndex] = updatedExpense;
    res.json(updatedExpense);
});

// DELETE (DELETE) an expense by ID
app.delete('/api/expenses/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const expenseIndex = expenses.findIndex(e => e.id === id);

    if (expenseIndex === -1) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    const deletedExpense = expenses.splice(expenseIndex, 1)[0];
    res.json(deletedExpense);
});

// Start the server
app.listen(port, () => {
    console.log(`Expense Tracker API listening on port ${port}`);
});
