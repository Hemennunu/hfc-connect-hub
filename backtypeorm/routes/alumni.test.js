const request = require('supertest');
const express = require('express');
const alumniRouter = require('./alumni');
const AppDataSource = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const Alumni = require('../entities/Alumni');

const app = express();
app.use(express.json());
app.use('/api/alumni', alumniRouter);

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
  const repository = AppDataSource.getRepository(Alumni);
  await repository.query('DELETE FROM alumni');
  if (nonAdminUser) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(nonAdminUser.id);
    nonAdminUser = null;
    nonAdminUser = null;
  }
});

describe('Alumni Routes', () => {
  it('should fetch public alumni profiles', async () => {
    const res = await request(app).get('/api/alumni/public');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new alumni', async () => {
    const res = await request(app)
      .post('/api/alumni')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test User',
        email: 'test@example.com',
        graduationYear: 2022,
        currentOccupation: 'Tester',
        yearsInProgram: '2020-2022',
        successStory: 'Test success story'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
  });

  it('should not create a new alumni with invalid data', async () => {
    const res = await request(app)
      .post('/api/alumni')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test User',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fetch all alumni (admin only)', async () => {
    const res = await request(app)
      .get('/api/alumni')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a single alumnus by ID (admin only)', async () => {
    const alumniRepository = AppDataSource.getRepository(Alumni);
    const newAlumni = alumniRepository.create({ name: 'Test User', email: 'test@example.com', graduationYear: 2022, currentOccupation: 'Tester', yearsInProgram: '2020-2022', successStory: 'Test success story' });
    await alumniRepository.save(newAlumni);

    const res = await request(app)
      .get(`/api/alumni/${newAlumni.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newAlumni.id);
  });

  it('should update an alumnus', async () => {
    const alumniRepository = AppDataSource.getRepository(Alumni);
    const newAlumni = alumniRepository.create({ name: 'Test User', email: 'test@example.com', graduationYear: 2022, currentOccupation: 'Tester', yearsInProgram: '2020-2022', successStory: 'Test success story' });
    await alumniRepository.save(newAlumni);

    const res = await request(app)
      .put(`/api/alumni/${newAlumni.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated User');
  });

  it('should delete an alumnus', async () => {
    const alumniRepository = AppDataSource.getRepository(Alumni);
    const newAlumni = alumniRepository.create({ name: 'Test User', email: 'test@example.com', graduationYear: 2022, currentOccupation: 'Tester', yearsInProgram: '2020-2022', successStory: 'Test success story' });
    await alumniRepository.save(newAlumni);

    const res = await request(app)
      .delete(`/api/alumni/${newAlumni.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Alumni deleted successfully');
  });

  it('should not allow non-admin users to access protected routes', async () => {
    const userRepository = AppDataSource.getRepository(User);
    nonAdminUser = userRepository.create({ name: 'Test User', email: 'user@test.com', password: 'password', role: 'user' });
    await userRepository.save(nonAdminUser);
    const nonAdminToken = jwt.sign({ user: { id: nonAdminUser.id, role: nonAdminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .post('/api/alumni')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Test User',
        email: 'test@example.com',
        graduationYear: 2022,
        currentOccupation: 'Tester',
        yearsInProgram: '2020-2022',
        successStory: 'Test success story'
      });
    expect(res.statusCode).toEqual(403);
  });
});