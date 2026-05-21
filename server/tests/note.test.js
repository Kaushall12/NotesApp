import { jest } from '@jest/globals';

// 1. Define mocks using unstable_mockModule for ES Modules
jest.unstable_mockModule('../middleware/authMiddleware.js', () => ({
  protect: (req, res, next) => {
    req.user = { _id: '664c3917dc94bc6ad78e2db2' };
    next();
  }
}));

jest.unstable_mockModule('../controllers/noteController.js', () => ({
  getNotes: (req, res) => res.status(200).json([{ _id: '1', title: 'Test Note', content: 'Test Content' }]),
  createNote: (req, res) => res.status(201).json({ _id: '2', title: 'New Note', content: 'New Content' }),
  updateNote: (req, res) => res.status(200).json({ _id: '1', title: 'Updated Note', content: 'Updated Content' }),
  deleteNote: (req, res) => res.status(200).json({ message: 'Note deleted' })
}));

// 2. Dynamically import modules so the mocks are applied correctly before loading
const { default: noteRoutes } = await import('../routes/noteRoutes.js');
const { default: express } = await import('express');
const { default: request } = await import('supertest');

const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

describe('Note API Routes', () => {
  it('should GET all notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toEqual(500);
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
