import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// Define the database file path
const dataDir = process.env.DATA_DIR || process.cwd();
const dbPath = path.join(dataDir, 'database.sqlite');
console.log(`Connecting to SQLite database at ${dbPath}`);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      compareAtPrice REAL,
      categoryId INTEGER,
      image TEXT,
      inStock INTEGER DEFAULT 1,
      isFeatured INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      image TEXT NOT NULL,
      type TEXT DEFAULT 'store' -- store, product, customer
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Initial admin user if none exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const hash = bcrypt.hashSync('Ghanshyam@2025', 10);
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hash);
  }

  // Pre-fill categories if empty
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCount.count === 0) {
    const categories = [
      'School Bags', 'College Bags', 'Office Bags', 'Laptop Bags', 
      'Travel Bags', 'Duffle Bags', 'Trolley Bags', 'Hard Luggage', 
      'Soft Luggage', 'Handbags', 'Kids Bags', 'Lunch Bags', 
      'Water Bottle Bags', 'Premium Collections'
    ];
    
    const insertCat = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
    categories.forEach(cat => {
      insertCat.run(cat, cat.toLowerCase().replace(/\\s+/g, '-'));
    });
  }

  // Pre-fill demo products if empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const defaultProducts = [
      { name: "Premium Safari Trolley Bag", price: 3499, compareAt: 4999, categoryId: 7, isFeatured: 1 },
      { name: "Skybags College Backpack", price: 1299, compareAt: 1999, categoryId: 2, isFeatured: 1 },
      { name: "American Tourister Hard Luggage", price: 4599, compareAt: 6000, categoryId: 8, isFeatured: 1 },
      { name: "VIP Executive Office Bag", price: 2199, compareAt: 3200, categoryId: 3, isFeatured: 1 },
      { name: "Kids Superhero School Bag", price: 899, compareAt: 1299, categoryId: 1, isFeatured: 0 },
      { name: "Waterproof Travel Duffle", price: 1599, compareAt: 2500, categoryId: 6, isFeatured: 0 }
    ];

    const insertProd = db.prepare('INSERT INTO products (name, slug, description, price, compareAtPrice, categoryId, inStock, isFeatured) VALUES (?, ?, ?, ?, ?, ?, 1, ?)');
    defaultProducts.forEach(p => {
      insertProd.run(p.name, p.name.toLowerCase().replace(/\\s+/g, '-'), "Premium quality material with durable zippers.", p.price, p.compareAt, p.categoryId, p.isFeatured);
    });
  }
}

export default db;
