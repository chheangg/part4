const listHelper = require('./list_helper');

describe('dummy tests', () => {
  test('dummy return one', () => {
    const blogs = [];
  
    const result = listHelper.dummy(listHelper.blogs)
    expect(result).toBe(1);
  })
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog);
    expect(result).toBe(5)
  })

  test('when list has multiple blogs, equals the like of all', () => {
    const result = listHelper.totalLikes(listHelper.blogs);
    expect(result).toBe(36);
  })

  test('when list has only one blog, return the author with most like', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('when list has only multiple blog, return the author with most like', () => {
    const result = listHelper.mostLikes(listHelper.blogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})

describe('total blogs', () => {
  test('when list has only one blog, return the author with most blog', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })

  test('when list multiple blogs, return the author with most blog', () => {
    const result = listHelper.mostBlogs(listHelper.blogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})
