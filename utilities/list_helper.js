const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const mostBlogs = (blogs) => {
  let countArr = [];
  const authorObject = blogs.reduce((authors, blog) => {
    console.log(authors)
    if (!authors[blog.author]) {
      authors[blog.author] = 1;
    } else {
      authors[blog.author] += 1;
    }
    return authors;
  }, {})

  for (const author in authorObject) {
    countArr.push({
      author: author,
      blogs: authorObject[author], 
    })
  }

  const mostBlogged = countArr.reduce((prev, curr) => Math.max(prev.blogs, curr.blogs) == prev.blogs ? prev : curr)

  return mostBlogged;
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
}