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

function likePost(event) {
  const heart = event.target

  if (heart.innerText == EMPTY_HEART) {
    // Change the heart to a full heart
    heart.innerText = FULL_HEART
    // Add the .activated-heart class to make the heart appear red
    heart.setAttribute("class", "activated-heart")
    // increase post num_of_likes
  } else { // When a user clicks on a full heart
    // Change the heart back to an empty heart
    heart.innerText = EMPTY_HEART
    // Remove the .activated-heart class
    heart.removeAttribute("class", "activated-heart")
    // decrease post num_of_likes
  }
}

function wantDog(event) {
  const dogBreedId = event.target.dataset.id
  const box = document.getElementById(`${dogBreedId}`)
  const adoptContainer = document.createElement("div")
  adoptContainer.innerText = "Dogs Available for Adoption"
  // fetch available dogs from rescuegroups.org api
  box.appendChild(adoptContainer)
}
