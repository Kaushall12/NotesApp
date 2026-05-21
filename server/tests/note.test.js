import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import noteRoutes from '../routes/noteRoutes.js';

// Mock the auth middleware
jest.mock('../middleware/authMiddleware.js', () => ({
  protect: (req, res, next) => {
    req.user = { _id: new mongoose.Types.ObjectId() };
    next();
  }
}));

// Mock the controllers
jest.mock('../controllers/noteController.js', () => ({
  getNotes: (req, res) => res.status(200).json([{ _id: '1', title: 'Test Note', content: 'Test Content' }]),
  createNote: (req, res) => res.status(201).json({ _id: '2', title: 'New Note', content: 'New Content' }),
  updateNote: (req, res) => res.status(200).json({ _id: '1', title: 'Updated Note', content: 'Updated Content' }),
  deleteNote: (req, res) => res.status(200).json({ message: 'Note deleted' })
}));

const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

describe('Note API Routes', () => {
  it('should GET all notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should POST a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ title: 'New Note', content: 'New Content' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should PUT update a note', async () => {
    const res = await request(app)
      .put('/api/notes/1')
      .send({ title: 'Updated Note' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Note');
  });

  it('should DELETE a note', async () => {
    const res = await request(app).delete('/api/notes/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Note deleted');
  });
});
