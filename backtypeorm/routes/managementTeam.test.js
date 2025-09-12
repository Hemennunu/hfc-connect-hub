const request = require('supertest');
const express = require('express');
const managementTeamRouter = require('./managementTeam');
const AppDataSource = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const ManagementTeam = require('../entities/ManagementTeam');

const app = express();
app.use(express.json());
app.use('/api/management-team', managementTeamRouter);

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
  const repository = AppDataSource.getRepository(ManagementTeam);
  await repository.query('DELETE FROM management_team');
  if (nonAdminUser) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(nonAdminUser.id);
    nonAdminUser = null;
  }
});

describe('Management Team Routes', () => {
  it('should fetch all active management team members (public)', async () => {
    const res = await request(app).get('/api/management-team');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch all management team members including inactive (admin only)', async () => {
    const res = await request(app)
      .get('/api/management-team/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new management team member with file upload', async () => {
    const res = await request(app)
      .post('/api/management-team')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Test Manager')
      .field('position', 'Project Lead')
      .attach('profileImage', './dummy.png');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Manager');
    expect(res.body.image).toMatch(/management-team-.*\.png/);
  });

  it('should create a new management team member with external image URL', async () => {
    const res = await request(app)
      .post('/api/management-team')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'External Image Manager',
        position: 'HR Manager',
        profileImageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=ManagerImage'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('External Image Manager');
    expect(res.body.image).toBe('https://via.placeholder.com/150/0000FF/FFFFFF?text=ManagerImage');
  });

  it('should not create a new management team member with invalid data', async () => {
    const res = await request(app)
      .post('/api/management-team')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Manager',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fetch a single management team member by ID', async () => {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const newMember = managementTeamRepository.create({ name: 'Test Manager', position: 'Project Lead' });
    await managementTeamRepository.save(newMember);

    const res = await request(app).get(`/api/management-team/${newMember.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newMember.id);
  });

  it('should update a management team member with file upload', async () => {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const newMember = managementTeamRepository.create({ name: 'Test Manager', position: 'Project Lead' });
    await managementTeamRepository.save(newMember);

    const res = await request(app)
      .put(`/api/management-team/${newMember.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Updated Manager')
      .attach('profileImage', './dummy.png');

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Manager');
    expect(res.body.image).toMatch(/management-team-.*\.png/);
  });

  it('should update a management team member with external image URL', async () => {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const newMember = managementTeamRepository.create({ name: 'Test Manager', position: 'Project Lead' });
    await managementTeamRepository.save(newMember);

    const res = await request(app)
      .put(`/api/management-team/${newMember.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated External Manager',
        profileImageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=UpdatedManager'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated External Manager');
    expect(res.body.image).toBe('https://via.placeholder.com/150/FF0000/FFFFFF?text=UpdatedManager');
  });

  it('should delete a management team member', async () => {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const newMember = managementTeamRepository.create({ name: 'Test Manager', position: 'Project Lead' });
    await managementTeamRepository.save(newMember);

    const res = await request(app)
      .delete(`/api/management-team/${newMember.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Management team member deleted successfully');
  });

  it('should not allow non-admin users to access protected routes', async () => {
    const userRepository = AppDataSource.getRepository(User);
    nonAdminUser = userRepository.create({ name: 'Test User', email: `user-${Date.now()}@test.com`, password: 'password', role: 'user' });
    await userRepository.save(nonAdminUser);
    const nonAdminToken = jwt.sign({ user: { id: nonAdminUser.id, role: nonAdminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/management-team')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Test Manager',
        position: 'Project Lead',
      });
    expect(res.statusCode).toEqual(403);
  });
});
