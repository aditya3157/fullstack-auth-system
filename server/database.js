const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'auth.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Initialize database schema
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password TEXT NOT NULL,
      bio TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      location TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Database initialized successfully at:', dbPath);
}

// Call initialization
initDatabase();

// Prepared statements for operations
const statements = {
  createUser: db.prepare(`
    INSERT INTO users (name, email, password, bio, phone, location, avatar_url)
    VALUES (@name, @email, @password, @bio, @phone, @location, @avatar_url)
  `),
  
  findUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  
  findUserById: db.prepare(`
    SELECT id, name, email, bio, phone, location, avatar_url, role, created_at, updated_at
    FROM users WHERE id = ?
  `),

  findUserByIdWithPassword: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),
  
  updateUserProfile: db.prepare(`
    UPDATE users
    SET name = @name,
        bio = @bio,
        phone = @phone,
        location = @location,
        avatar_url = @avatar_url,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),

  updateUserPassword: db.prepare(`
    UPDATE users
    SET password = @password,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),

  getAllUsers: db.prepare(`
    SELECT id, name, email, bio, phone, location, avatar_url, role, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `)
};

module.exports = {
  db,
  createUser: (data) => {
    const info = statements.createUser.run({
      name: data.name,
      email: data.email.trim().toLowerCase(),
      password: data.password,
      bio: data.bio || '',
      phone: data.phone || '',
      location: data.location || '',
      avatar_url: data.avatar_url || ''
    });
    return statements.findUserById.get(info.lastInsertRowid);
  },

  findUserByEmail: (email) => {
    return statements.findUserByEmail.get(email.trim().toLowerCase());
  },

  findUserById: (id) => {
    return statements.findUserById.get(id);
  },

  findUserByIdWithPassword: (id) => {
    return statements.findUserByIdWithPassword.get(id);
  },

  updateUserProfile: (id, data) => {
    statements.updateUserProfile.run({
      id,
      name: data.name,
      bio: data.bio || '',
      phone: data.phone || '',
      location: data.location || '',
      avatar_url: data.avatar_url || ''
    });
    return statements.findUserById.get(id);
  },

  updateUserPassword: (id, hashedPassword) => {
    statements.updateUserPassword.run({
      id,
      password: hashedPassword
    });
    return true;
  },

  getAllUsers: () => {
    return statements.getAllUsers.all();
  }
};
