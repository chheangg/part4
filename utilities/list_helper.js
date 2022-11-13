const Blog = require('../models/Blog');

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const mostAttribute = (attribute, attributeCallback) => {
  return (blogs) => {
    let countArr = [];
    const authorObject = blogs.reduce(attributeCallback, {})
  
    for (const author in authorObject) {
      const newAuthorObj = {
        author: author,
      }
      newAuthorObj[attribute] = authorObject[author]

      countArr.push(newAuthorObj)
    }
  
    const mostAttributeCount = countArr.reduce((prev, curr) => Math.max(prev[attribute], curr[attribute]) == prev[attribute] ? prev : curr)
  
    return mostAttributeCount;
  }
}

const mostBlogs = mostAttribute('blogs', (authors, blog) => {
  if (!authors[blog.author]) {
    authors[blog.author] = 1;
  } else {
    authors[blog.author] += 1;
  }
  return authors;
});

const mostLikes = mostAttribute('likes', (authors, blog) => {
  if (!authors[blog.author]) {
    authors[blog.author] = blog.likes;
  } else {
    authors[blog.author] += blog.likes;
  }

  return authors;
})

const blogsFromDb = async () => {
  const results = await Blog.find({})
  const mappedResults = results.map(blog => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
    }
  })

  return mappedResults;
}

const nonExistingId = async () => {
  const blog = new Blog({title: 'test', author: 'test', url: 'test'});
  await blog.save()
  await blog.delete()
  return blog._id.toString();
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes,
  listWithOneBlog,
  blogs,
  blogsFromDb,
  nonExistingId,
}