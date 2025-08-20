const express = require('express');
const path = require('path');
const { registerUser, verifyUser, listUsers } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Debug endpoint to list users
app.get('/api/debug/users', async (req, res) => {
    try {
        const users = await listUsers();
        res.json({ users });
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: 'Failed to list users' });
    }
});

// Debug route to list all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await listUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// API Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Registration attempt for email:', email);
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await registerUser(name, email, password);
        console.log('Registration successful for user:', user);
        
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful',
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.message === 'Email already exists') {
            res.status(400).json({ error: 'Email already registered' });
        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await verifyUser(email, password);
        console.log('Login successful for user:', user);
        
        // Send response with user data
        res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: 'Invalid email or password' });
        } else {
            res.status(500).json({ error: 'Login failed' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 