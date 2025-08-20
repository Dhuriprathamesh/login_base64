const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the database directory exists
const dbPath = path.join(__dirname, 'users.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Users table ready');
            }
        });
    }
});

// Function to register a new user
function registerUser(name, email, password) {
    return new Promise((resolve, reject) => {
        // Convert password to base64
        const encodedPassword = Buffer.from(password).toString('base64');
        console.log('Registering user:', { name, email });
        
        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, encodedPassword], function(err) {
            if (err) {
                console.error('Registration error:', err);
                if (err.message.includes('UNIQUE constraint failed')) {
                    reject(new Error('Email already exists'));
                } else {
                    reject(err);
                }
            } else {
                console.log('User registered successfully with ID:', this.lastID);
                resolve({ id: this.lastID, name, email });
            }
        });
    });
}

// Function to verify user login
function verifyUser(email, password) {
    return new Promise((resolve, reject) => {
        const encodedPassword = Buffer.from(password).toString('base64');
        console.log('Verifying user:', { email });
        
        // First, let's check if the user exists
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            } else if (!row) {
                console.log('User not found:', email);
                reject(new Error('Invalid credentials'));
            } else {
                console.log('User found, verifying password');
                // Now check the password
                if (row.password === encodedPassword) {
                    console.log('Password verified successfully');
                    resolve({
                        id: row.id,
                        name: row.name,
                        email: row.email
                    });
                } else {
                    console.log('Password verification failed');
                    reject(new Error('Invalid credentials'));
                }
            }
        });
    });
}

// Function to list all users (for debugging)
function listUsers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, name, email FROM users', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    registerUser,
    verifyUser,
    listUsers
}; 