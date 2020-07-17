console.log("in index.js");

const endPoint = "http://localhost:3000/api/v1/posts"

document.addEventListener('DOMContentLoaded', () => {
    console.log('LOADED');
    getPosts()
  });

/* GET request */
function getPosts() {
  fetch(endPoint)
  .then(res => res.json())
  .then(posts => {
    console.log(posts)
    posts.data.forEach(post => {
      const postMarkup = `
      <div data-id=${post.id}>
        <img src=${post.attributes.picture} height="300" width="350">
        <h3>Breed: ${post.attributes.breed.name}</h3>
        <p>Likes: ${post.attributes.num_of_likes}</p>
      </div>
      <br><br>`;
      document.querySelector('#post-container').innerHTML += postMarkup
    })
  })
}