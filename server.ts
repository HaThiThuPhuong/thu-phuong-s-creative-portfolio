import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDb } from './src/lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDb();

  app.use(express.json());

  // API Routes
  app.get('/api/profile', (req, res) => {
    console.log('GET /api/profile');
    try {
      const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
      res.json(profile || {});
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/assets', (req, res) => {
    console.log('GET /api/assets', req.query);
    try {
      const { type } = req.query;
      let assets;
      if (type) {
        assets = db.prepare('SELECT * FROM assets WHERE type = ?').all(type);
      } else {
        assets = db.prepare('SELECT * FROM assets').all();
      }
      res.json(assets || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/calendar', (req, res) => {
    console.log('GET /api/calendar');
    try {
      const calendar = db.prepare('SELECT * FROM calendar').all();
      res.json(calendar || []);
    } catch (error) {
      console.error('Error fetching calendar:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/services', (req, res) => {
    console.log('GET /api/services', req.query);
    try {
      const { mode } = req.query;
      let services;
      if (mode) {
        services = db.prepare('SELECT * FROM services WHERE mode = ?').all(mode);
      } else {
        services = db.prepare('SELECT * FROM services').all();
      }
      res.json((services || []).map((s: any) => ({
        ...s,
        benefits: JSON.parse(s.benefits || '[]')
      })));
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/milestones', (req, res) => {
    console.log('GET /api/milestones');
    try {
      const milestones = db.prepare('SELECT * FROM career_milestones').all();
      res.json((milestones || []).map((m: any) => ({
        ...m,
        projects: JSON.parse(m.projects || '[]')
      })));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/ba-projects', (req, res) => {
    console.log('GET /api/ba-projects');
    try {
      const projects = db.prepare('SELECT * FROM ba_projects').all();
      res.json((projects || []).map((p: any) => ({
        ...p,
        images: JSON.parse(p.images || '[]'),
        tags: JSON.parse(p.tags || '[]')
      })));
    } catch (error) {
      console.error('Error fetching BA projects:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/life-hobbies', (req, res) => {
    console.log('GET /api/life-hobbies');
    try {
      const items = db.prepare('SELECT * FROM life_hobbies').all();
      res.json(items || []);
    } catch (error) {
      console.error('Error fetching life hobbies:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Serve Vite or static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
