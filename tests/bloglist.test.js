const mongoose = require('mongoose');
const supertest = require('supertest');
const listHelper = require('../utilities/list_helper');
const Blog = require('../models/Blog')
const app = require('../app');

const api = supertest(app);

beforeAll(async () => {
  await Blog.deleteMany({});
  const blogInstances = listHelper.blogs.map((blog) => new Blog(blog));
  const savesArray = blogInstances.map((instance) => instance.save());
  // Hang until all async func has been completed
  await Promise.all(savesArray);
})

describe('blog-list tests', () => {
  test('Check if bloglists are returned correctly', async () => {
    const results = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
    expect(results.body.length).toBe(listHelper.blogs.length);
    expect(results.body).toContainEqual(listHelper.listWithOneBlog[0]);
  })
})

afterAll(() => {
  mongoose.connection.close();
})