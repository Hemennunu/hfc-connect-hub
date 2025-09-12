const request = require('supertest');
const express = require('express');
const boardMemberRouter = require('./boardMember');
const AppDataSource = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const BoardMember = require('../entities/BoardMember');
const axios = require('axios');

jest.mock('axios');

axios.mockImplementation((config) => {
  if (config.url.includes('via.placeholder.com')) {
    return Promise.resolve({
      data: {
        pipe: jest.fn((destination) => {
          // Simulate stream ending
          if (destination && destination.on) {
            destination.on('finish', () => {}); // No-op, as we resolve immediately
          }
          return { on: (event, callback) => { if (event === 'finish') callback(); } };
        })
      },
      status: 200,
    });
  }
  return jest.requireActual('axios')(config);
});

const app = express();
app.use(express.json());
app.use('/api/board-members', boardMemberRouter);

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
  const repository = AppDataSource.getRepository(BoardMember);
  await repository.query('DELETE FROM board_members');
  if (nonAdminUser) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(nonAdminUser.id);
    nonAdminUser = null;
  }
});

describe('Board Member Routes', () => {
  it('should fetch all board members (public)', async () => {
    const res = await request(app).get('/api/board-members');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch all board members including inactive (admin only)', async () => {
    const res = await request(app)
      .get('/api/board-members/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new board member with file upload', async () => {
    const res = await request(app)
      .post('/api/board-members')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Member')
      .field('role', 'Secretary')
      .attach('profileImage', './dummy.png');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Member');
    expect(res.body.profileImage).toMatch(/\d+\.png/); // Matches filename like 12345.png
  });

  it('should create a new board member with external image URL', async () => {
    const res = await request(app)
      .post('/api/board-members')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'External Image Member',
        role: 'Treasurer',
        profileImageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=MemberImage'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('External Image Member');
    expect(res.body.profileImage).toMatch(/\d+\.jpg/); // Matches filename like 12345.jpg
  });

  it('should not create a new board member with invalid data', async () => {
    const res = await request(app)
      .post('/api/board-members')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Member',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fetch a single board member by ID', async () => {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const newMember = boardMemberRepository.create({ name: 'Test Member', role: 'Secretary' });
    await boardMemberRepository.save(newMember);

    const res = await request(app).get(`/api/board-members/${newMember.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newMember.id);
  });

  it('should update a board member with file upload', async () => {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const newMember = boardMemberRepository.create({ name: 'Test Member', role: 'Secretary' });
    await boardMemberRepository.save(newMember);

    const res = await request(app)
      .put(`/api/board-members/${newMember.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Updated Member')
      .attach('profileImage', './dummy.png');

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Member');
    expect(res.body.profileImage).toMatch(/\d+\.png/);
  });

  it('should update a board member with external image URL', async () => {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const newMember = boardMemberRepository.create({ name: 'Test Member', role: 'Secretary' });
    await boardMemberRepository.save(newMember);

    const res = await request(app)
      .put(`/api/board-members/${newMember.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated External Member',
        profileImageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=UpdatedImage'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated External Member');
    expect(res.body.profileImage).toMatch(/\d+\.jpg/);
  });

  it('should delete a board member', async () => {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const newMember = boardMemberRepository.create({ name: 'Test Member', role: 'Secretary' });
    await boardMemberRepository.save(newMember);

    const res = await request(app)
      .delete(`/api/board-members/${newMember.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Board member deleted successfully');
  });

  it('should not allow non-admin users to access protected routes', async () => {
    const userRepository = AppDataSource.getRepository(User);
    nonAdminUser = userRepository.create({ name: 'Test User', email: `user-${Date.now()}@test.com`, password: 'password', role: 'user' });
    await userRepository.save(nonAdminUser);
    const nonAdminToken = jwt.sign({ user: { id: nonAdminUser.id, role: nonAdminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/board-members')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Test Member',
        role: 'Secretary',
      });
    expect(res.statusCode).toEqual(403);
  });
});