const request = require('supertest');
const express = require('express');
const galleryRouter = require('./gallery');
const AppDataSource = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const GalleryItem = require('../entities/GalleryItem');

jest.mock('../socket', () => ({
  getIo: jest.fn(() => ({
    emit: jest.fn(),
  })),
}));

const app = express();
app.use(express.json());
app.use('/api/gallery', galleryRouter);

let token;
let user;

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
  const repository = AppDataSource.getRepository(GalleryItem);
  await repository.query('DELETE FROM gallery_items');
});

describe('Gallery Routes', () => {
  it('should fetch all published gallery items (public)', async () => {
    const res = await request(app).get('/api/gallery');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch all gallery items including unpublished (admin only)', async () => {
    const res = await request(app)
      .get('/api/gallery/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new gallery item', async () => {
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Gallery Item')
      .field('category', 'Events')
      .attach('media', './dummy.png'); // Assuming dummy.png exists in the backtypeorm directory

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Gallery Item');
  });

  it('should not create a new gallery item with invalid data', async () => {
    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Gallery Item',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should fetch a single gallery item by ID', async () => {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const newGalleryItem = galleryRepository.create({
      title: 'Test Gallery Item',
      category: 'Events',
      mediaUrl: 'test.jpg'
    });
    await galleryRepository.save(newGalleryItem);

    const res = await request(app).get(`/api/gallery/${newGalleryItem.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', newGalleryItem.id);
  });

  it('should update a gallery item', async () => {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const newGalleryItem = galleryRepository.create({
      title: 'Test Gallery Item',
      category: 'Events',
      mediaUrl: 'test.jpg'
    });
    await galleryRepository.save(newGalleryItem);

    const res = await request(app)
      .put(`/api/gallery/${newGalleryItem.id}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Updated Gallery Item');

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Updated Gallery Item');
  });

  it('should delete a gallery item', async () => {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const newGalleryItem = galleryRepository.create({
      title: 'Test Gallery Item',
      category: 'Events',
      mediaUrl: 'test.jpg'
    });
    await galleryRepository.save(newGalleryItem);

    const res = await request(app)
      .delete(`/api/gallery/${newGalleryItem.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Gallery item deleted successfully');
  });

  it('should not allow non-admin users to access protected routes', async () => {
    const userRepository = AppDataSource.getRepository(User);
    const nonAdminUser = userRepository.create({ name: 'Test User', email: 'user@test.com', password: 'password', role: 'user' });
    await userRepository.save(nonAdminUser);
    const nonAdminToken = jwt.sign({ user: { id: nonAdminUser.id, role: nonAdminUser.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/gallery')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        title: 'Test Gallery Item',
        category: 'Events',
        mediaUrl: 'test.jpg'
      });
    expect(res.statusCode).toEqual(403);
    await userRepository.delete(nonAdminUser.id);
  });
});
