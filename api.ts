import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import db, { initDB } from './db.js';
import crypto from 'crypto';

// Initialize the database tables
initDB();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ghanshyam123supersecret';

const dataDir = process.env.DATA_DIR || process.cwd();
const uploadsDir = path.join(dataDir, 'uploads');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure dir exists
    import('fs').then(fs => {
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      cb(null, uploadsDir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Types
import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
  user?: any;
}

// Authentication Middleware
const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ==========================================
// AUTH ROUTES
// ==========================================

router.post('/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/update-credentials', requireAuth, (req: AuthRequest, res: Response) => {
  try {
    const { newUsername, newPassword, currentPassword } = req.body;
    const userId = req.user.id;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    
    // Verify current password first if they are changing password
    if (newPassword && !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    if (newUsername) {
      try {
        db.prepare('UPDATE users SET username = ? WHERE id = ?').run(newUsername, userId);
      } catch (e: any) {
        if (e.message.includes('UNIQUE')) return res.status(400).json({ error: 'Username already taken' });
        throw e;
      }
    }

    if (newPassword) {
      const hash = bcrypt.hashSync(newPassword, 10);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, userId);
    }

    res.json({ success: true, message: 'Credentials updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PUBLIC CONTEND ENDPOINTS
// ==========================================

router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products', (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = 'SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id';
    const params: any[] = [];
    
    if (category) {
      query += ' WHERE c.slug = ?';
      params.push(category);
    } else if (featured === 'true') {
      query += ' WHERE p.isFeatured = 1';
    }

    query += ' ORDER BY p.createdAt DESC';
    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/:slug', (req, res) => {
  try {
    const product = db.prepare('SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE p.slug = ?').get(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/gallery', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM gallery ORDER BY id DESC').all();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/settings', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM settings').all() as any[];
    const settings = items.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PROTECTED ADMIN ENDPOINTS
// ==========================================

router.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the path relative to the domain (using static hosting)
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post('/products', requireAuth, (req, res) => {
  try {
    const p = req.body;
    let slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if slug exists
    const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
    if (exists) slug = `${slug}-${Date.now()}`;

    const info = db.prepare(`
      INSERT INTO products (name, slug, description, price, compareAtPrice, categoryId, image, inStock, isFeatured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      p.name, slug, p.description || '', p.price, p.compareAtPrice || null, 
      p.categoryId, p.image || null, p.inStock ? 1 : 0, p.isFeatured ? 1 : 0
    );
    res.json({ success: true, id: info.lastInsertRowid, slug });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', requireAuth, (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;
    db.prepare(`
      UPDATE products SET name=?, description=?, price=?, compareAtPrice=?, categoryId=?, image=?, inStock=?, isFeatured=?
      WHERE id=?
    `).run(
      p.name, p.description || '', p.price, p.compareAtPrice || null, 
      p.categoryId, p.image || null, p.inStock ? 1 : 0, p.isFeatured ? 1 : 0, id
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categories', requireAuth, (req, res) => {
  try {
    const { name, image } = req.body;
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    db.prepare('INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)').run(name, slug, image || null);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/categories/:id', requireAuth, (req, res) => {
  try {
    // Nullify products
    db.prepare('UPDATE products SET categoryId = NULL WHERE categoryId = ?').run(req.params.id);
    db.prepare('DELETE FROM categories WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gallery', requireAuth, (req, res) => {
  try {
    const { title, image, type } = req.body;
    db.prepare('INSERT INTO gallery (title, image, type) VALUES (?, ?, ?)').run(title || '', image, type || 'store');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/gallery/:id', requireAuth, (req, res) => {
  try {
    db.prepare('DELETE FROM gallery WHERE id=?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
