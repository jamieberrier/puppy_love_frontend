console.log("in index.js");

const endPoint = "http://localhost:3000/api/v1/posts"

document.addEventListener('DOMContentLoaded', () => {
    console.log('LOADED');
    getPosts()
  });

// GET request
function getPosts() {
  fetch(endPoint)
  .then(res => res.json())
  .then(posts => {
    console.log(posts)
    posts.data.forEach(post => {
      const postMarkup = `
      <div class="box" data-id=${post.id}>
        <figure class="image is-256x256">
          <img src=${post.attributes.picture}>
        </figure>
        <nav class="level is-mobile">
          <div class="level-left">
            <p class="level-item">Likes: ${post.attributes.num_of_likes}</p>
          </div>
          <div class="level-right">
          <p class="level-item"><strong>I Want One!</strong></p>
          </div>
        </nav>
      </div>`;
      document.querySelector('#post-container').innerHTML += postMarkup
    })
  })
}