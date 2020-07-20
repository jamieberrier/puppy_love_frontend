// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡'
const FULL_HEART = '♥'

const endPoint = "http://localhost:3000/api/v1/posts"

document.addEventListener('DOMContentLoaded', () => {
  console.log('LOADED'); // take out
  getPosts()
});

// GET request
function getPosts() {
  fetch(endPoint)
  .then(res => res.json())
  .then(posts => {
    console.log(posts) // take out
    posts.data.forEach(post => {
      const newPost = new Post(post);
      newPost.renderPost();
    })
  });
}
