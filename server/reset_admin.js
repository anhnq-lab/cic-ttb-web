const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const newPassword = 'admin123';
const saltRounds = 10;

console.log('Resetting admin password...');

bcrypt.hash(newPassword, saltRounds, function (err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }

    db.serialize(() => {
        // Check if admin exists
        db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return;
            }

            if (row) {
                // Update existing admin
                db.run("UPDATE users SET password_hash = ? WHERE username = 'admin'", [hash], function (err) {
                    if (err) console.error('Error updating admin:', err);
                    else console.log('Admin password updated to: admin123');
                });
            } else {
                // Create new admin
                db.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", ['admin', hash, 'admin'], function (err) {
                    if (err) console.error('Error creating admin:', err);
                    else console.log('Admin account created: admin / admin123');
                });
            }
        });
    });
});
