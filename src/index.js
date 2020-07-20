// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡'
const FULL_HEART = '♥'

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
      renderPost(post)
    })
  });
}

function renderPost(post) {
  const postContainer = document.getElementById("post-container");
  // create box
  const postBox = document.createElement("div");
  postBox.setAttribute("class", "box");
  postBox.setAttribute("data-id", post.id);
  // picture
  const figure = document.createElement("figure");
  figure.setAttribute("class", "image is-256x256")
  const postImage = document.createElement("img");
  postImage.src = post.attributes.picture;
  figure.appendChild(postImage);
  postBox.appendChild(figure);
  // create level for Likes & I Want One
  const level = document.createElement("nav");
  level.setAttribute("class", "level is-mobile");
  // left
  const left = document.createElement("div");
  left.setAttribute("class", "level-left")
  // heart
  const heart = document.createElement("span");
  heart.setAttribute("class", "level-item like-glyph")
  heart.innerHTML = '&#x2661';
  left.appendChild(heart)
  // likes
  const postLikes = document.createElement('p');
  postLikes.setAttribute("class", "level-item")
  postLikes.innerText = post.attributes.num_of_likes;
  left.appendChild(postLikes);
  level.appendChild(left);
  // right
  const right = document.createElement("div");
  right.setAttribute("class", "level-right")
  // I Want One
  const wantOne = document.createElement('p');
  wantOne.setAttribute("class", "level-item")
  wantOne.innerText = "I Want One!";
  right.appendChild(wantOne);
  level.appendChild(right);
  // add level
  postBox.appendChild(level);
  // add box
  postContainer.appendChild(postBox);
}