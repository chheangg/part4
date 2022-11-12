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

  test('Check if ID property exists', async () => {
    const results = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
    expect(results.body[0].id).toBeDefined()
  })

  test('Check if POST request is successful', async () => {
    const newBlog = {
      title: 'This is a test title',
      author: 'Chheang Ly',
      url: 'http://localhost/',
      likes: 5,
    }
    
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const results = await listHelper.blogsFromDb();

    expect(results.length).toBe(listHelper.blogs.length + 1);
    expect(results).toContainEqual(newBlog);
  })

  test('Check if value of likes default to zero on POST request', async () => {
    const newBlog = {
      title: 'This is a test title',
      author: 'Chheang Ly',
      url: 'http://localhost/',
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const results = awaitListHelper.blogsFromDb();

    expect(results).toContainEqual({...newBlog, likes: 0});
  })

  test('Check if POST request returns 400 on bad request', async () => {
    const newBlog_1 = {
      title: '',
      author: '',
      url: 'http://localhost/',
    }

    const newBlog_2 = {
      title: '',
      author: 'Chheangg',
      url: 'http://localhost/',
    }

    await api.post('/api/blogs')
      .send(newBlog_1)
      .expect(400);

    await api.post('/api/blogs')
      .send(newBlog_2)
      .expect(400);
  })
})

afterAll(() => {
  mongoose.connection.close();
})