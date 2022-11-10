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

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes,
}