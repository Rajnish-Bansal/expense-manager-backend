const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Expense Schema and Model
const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Get all expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching expenses', error: err.message });
    }
});

app.get('/try', (req, res) => {
    res.send('server is running')
})
        
// Add a new expense
app.post('/add-expense', async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;
        const newExpense = new Expense({ title, amount, category, date, description });
        await newExpense.save();
        res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    } catch (err) {
        res.status(500).json({ message: 'Error adding expense', error: err.message });
    }
});

// Delete an expense
app.delete('/delete-expense/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Expense.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting expense', error: err.message });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Expense Manager Backend is running');
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
