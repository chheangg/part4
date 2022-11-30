const mongoose = require('mongoose');
const supertest = require('supertest');
const listHelper = require('./list_helper');
const Blog = require('../models/blog')
const app = require('../app');

const api = supertest(app);

beforeAll(async () => {
  await Blog.deleteMany({});
  const blogInstances = listHelper.blogs.map((blog) => new Blog(blog));
  const savesArray = blogInstances.map((instance) => instance.save());
  // Hang until all async func has been completed
  await Promise.all(savesArray);
})

describe('When there are some blogs saved', () => {
  test('Check if bloglists are returned correctly', async () => {
    const results = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
    expect(results.body.length).toBe(listHelper.blogs.length);
  })

  test('Check if ID property exists', async () => {
    const results = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
    expect(results.body[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
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

    const results = await listHelper.blogsFromDb();

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

describe('updating a single blog', () => {
  test('suceeds with a valid update', async () => {
    const blogs = await Blog.find({});
    const sampleBlog = blogs[0];
    const newBlog = {
      title: 'This is a test title',
      author: 'Chheang Ly',
      url: 'http://localhost/',
      id: sampleBlog.id,
      __v: 0,
      likes: 0,
    }

    const updatedBlog = await api.put(`/api/blogs/${sampleBlog.id}`).send(newBlog).expect(200).expect('Content-Type', /application\/json/);
    
    const formattedBlog = JSON.parse(JSON.stringify(newBlog));
    expect(updatedBlog.body).toEqual(formattedBlog);
  })

  test('return 404 with a non existing id', async () => {
    const nonExistingId = await listHelper.nonExistingId();
    const newBlog = {
      title: 'This is a test title',
      author: 'Chheang Ly',
      url: 'http://localhost/',
      id: nonExistingId,
      __v: 0,
      likes: 0,
    }
    await api.put(`/api/blogs/${nonExistingId}`).send(newBlog).expect(404);
  })
  test('no update and return 400 with a malformed ID', async () => {
    const malformedId = 12345;
    const newBlog = {
      title: 'This is a test title',
      author: 'Chheang Ly',
      url: 'http://localhost/',
      id: malformedId,
      __v: 0,
      likes: 0,
    }

    await api.put(`/api/blogs/${malformedId}`).send(newBlog).expect(400);
  })
})

describe('viewing specific blog', () => {
  test('suceeds with a valid id', async () => {
    const blogs = await Blog.find({});
    const sampleBlog = blogs[0];

    const response = await api.get(`/api/blogs/${sampleBlog.id}`).expect(200).expect('Content-Type', /application\/json/);
    const processedBlogToView = JSON.parse(JSON.stringify(sampleBlog))

    expect(response.body).toEqual(processedBlogToView);
  })

  test('return 404 with a non existing id', async () => {
    const nonExistingId = await listHelper.nonExistingId();
    await api.get(`/api/blogs/${nonExistingId}`).expect(404);
  })

  test('return 400 with a malformed ID', async () => {
    const malformedId = '313124123'
    await api.get(`/api/blogs/${malformedId}`).expect(400);
  })
})

afterAll(() => {
  mongoose.connection.close();
})