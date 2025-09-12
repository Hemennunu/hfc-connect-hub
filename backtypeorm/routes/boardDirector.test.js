const request = require('supertest');
const express = require('express');
const boardDirectorRouter = require('./boardDirector');
const AppDataSource = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const BoardDirector = require('../entities/BoardDirector');

jest.mock('../socket', () => ({
  getIo: jest.fn(() => ({
    emit: jest.fn(),
  })),
}));

const app = express();
app.use(express.json());
app.use('/api/board-directors', boardDirectorRouter);

let token;
let user;
let nonAdminUser;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepository = AppDataSource.getRepository(User);
  user = userRepository.create({ name: 'Test Admin', email: `admin-${Date.now()}@test.com`, password: 'password', role: 'admin' });
  await userRepository.save(user);
  token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  const userRepository = AppDataSource.getRepository(User);
  if (user) {
    await userRepository.delete(user.id);
  }
  await AppDataSource.destroy();
});

afterEach(async () => {
  const repository = AppDataSource.getRepository(BoardDirector);
  await repository.query('DELETE FROM board_directors');
  if (nonAdminUser) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(nonAdminUser.id);
    nonAdminUser = null;
  }
});

describe('Board Director Routes', () => {
  it('should fetch all board directors (public)', async () => {
    const res = await request(app).get('/api/board-directors');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch all board directors (admin only)', async () => {
    const res = await request(app)
      .get('/api/board-directors/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new board director with file upload', async () => {
    const res = await request(app)
      .post('/api/board-directors')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Director')
      .field('position', 'CEO')
      .attach('profileImage', './dummy.png');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Director');
    expect(res.body.profileImage).toMatch(/board-director-.*\.png/);
  });

  it('should create a new board director with external image URL', async () => {
    const res = await request(app)
      .post('/api/board-directors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'External Image Director',
        position: 'CTO',
        profileImageUrl: 'https://example.com/image.jpg'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('External Image Director');
    expect(res.body.profileImage).toBe('https://example.com/image.jpg');
  });

  it('should not create a new board director with invalid data', async () => {
    const res = await request(app)
      .post('/api/board-directors')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Director',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fetch a single board director by ID', async () => {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const newDirector = boardDirectorRepository.create({ name: 'Test Director', position: 'CEO' });
    await boardDirectorRepository.save(newDirector);

    const res = await request(app).get(`/api/board-directors/${newDirector.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newDirector.id);
  });

  it('should update a board director with file upload', async () => {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const newDirector = boardDirectorRepository.create({ name: 'Test Director', position: 'CEO' });
    await boardDirectorRepository.save(newDirector);

    const res = await request(app)
      .put(`/api/board-directors/${newDirector.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Updated Director')
      .attach('profileImage', './dummy.png');

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Director');
    expect(res.body.profileImage).toMatch(/board-director-.*\.png/);
  });

  it('should update a board director with external image URL', async () => {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const newDirector = boardDirectorRepository.create({ name: 'Test Director', position: 'CEO' });
    await boardDirectorRepository.save(newDirector);

    const res = await request(app)
      .put(`/api/board-directors/${newDirector.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated External Director',
        profileImageUrl: 'https://example.com/updated_image.jpg'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated External Director');
    expect(res.body.profileImage).toBe('https://example.com/updated_image.jpg');
  });

  it('should delete a board director', async () => {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const newDirector = boardDirectorRepository.create({ name: 'Test Director', position: 'CEO' });
    await boardDirectorRepository.save(newDirector);

    const res = await request(app)
      .delete(`/api/board-directors/${newDirector.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Board director deleted successfully');
  });

  it('should not allow non-admin users to access protected routes', async () => {
    const userRepository = AppDataSource.getRepository(User);
    nonAdminUser = userRepository.create({ name: 'Test User', email: `user-${Date.now()}@test.com`, password: 'password', role: 'user' });
    await userRepository.save(nonAdminUser);
    const nonAdminToken = jwt.sign({ user: { id: nonAdminUser.id, role: nonAdminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/board-directors')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Test Director',
        position: 'CEO',
      });
    expect(res.statusCode).toEqual(403);
  });
});
