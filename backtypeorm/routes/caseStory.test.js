const request = require('supertest');
const express = require('express');
const caseStoryRouter = require('./caseStory');
const AppDataSource = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const CaseStory = require('../entities/CaseStory');

const app = express();
app.use(express.json());
app.use('/api/case-stories', caseStoryRouter);

let token;
let user;

beforeAll(async () => {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);
  user = userRepository.create({ name: 'Test Admin', email: `admin-${Date.now()}@test.com`, password: 'password', role: 'admin' });
  await userRepository.save(user);
  token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.delete(user.id);
  await AppDataSource.destroy();
});

afterEach(async () => {
  const repository = AppDataSource.getRepository(CaseStory);
  await repository.query('DELETE FROM case_stories');
});

describe('Case Story Routes', () => {
  it('should fetch all published case stories (public)', async () => {
    const res = await request(app).get('/api/case-stories');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch all case stories including unpublished (admin only)', async () => {
    const res = await request(app)
      .get('/api/case-stories/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new case story', async () => {
    const res = await request(app)
      .post('/api/case-stories')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Case Story')
      .field('content', 'This is the content of the test case story.')
      .field('beneficiaryName', 'John Doe')
      .field('category', 'Child Development')
      .attach('media', './dummy.png'); // Assuming dummy.png exists in the backtypeorm directory

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Case Story');
  });

  it('should not create a new case story with invalid data', async () => {
    const res = await request(app)
      .post('/api/case-stories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Case Story',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fetch a single case story by ID', async () => {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const newCaseStory = caseStoryRepository.create({
      title: 'Test Case Story',
      content: 'This is the content of the test case story.',
      beneficiaryName: 'John Doe',
      category: 'Child Development',
    });
    await caseStoryRepository.save(newCaseStory);

    const res = await request(app).get(`/api/case-stories/${newCaseStory.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newCaseStory.id);
  });

  it('should update a case story', async () => {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const newCaseStory = caseStoryRepository.create({
      title: 'Test Case Story',
      content: 'This is the content of the test case story.',
      beneficiaryName: 'John Doe',
      category: 'Child Development',
    });
    await caseStoryRepository.save(newCaseStory);

    const res = await request(app)
      .put(`/api/case-stories/${newCaseStory.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Updated Case Story');

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Updated Case Story');
  });

  it('should delete a case story', async () => {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const newCaseStory = caseStoryRepository.create({
      title: 'Test Case Story',
      content: 'This is the content of the test case story.',
      beneficiaryName: 'John Doe',
      category: 'Child Development',
    });
    await caseStoryRepository.save(newCaseStory);

    const res = await request(app)
      .delete(`/api/case-stories/${newCaseStory.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Case story deleted successfully');
  });

  it('should not allow non-admin users to access protected routes', async () => {
    const userRepository = AppDataSource.getRepository(User);
    const nonAdminUser = userRepository.create({ name: 'Test User', email: 'user@test.com', password: 'password', role: 'user' });
    await userRepository.save(nonAdminUser);
    const nonAdminToken = jwt.sign({ user: { id: nonAdminUser.id, role: nonAdminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/case-stories')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        title: 'Test Case Story',
        content: 'This is the content of the test case story.',
        beneficiaryName: 'John Doe',
        category: 'Child Development',
      });
    expect(res.statusCode).toEqual(403);
    await userRepository.delete(nonAdminUser.id);
  });
});
