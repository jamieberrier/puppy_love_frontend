// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡'
const FULL_HEART = '♥'

const endPoint = "http://localhost:3000/api/v1/posts"
const dogBreedEndPoint = "https://dog.ceo/api/breeds/list/all"

document.addEventListener('DOMContentLoaded', () => {
  getPosts()
  getBreeds()
});

// GET request
function getPosts() {
  fetch(endPoint)
  .then(response => response.json())
  .then(posts => {
    posts.data.forEach(post => {
      const newPost = new Post(post);
      newPost.renderPost();
    })
  });
}

function getBreeds() {
  fetch(dogBreedEndPoint)
  .then(response => response.json())
  .then(dogBreeds => {
    // the return value is an Array containing all of the keys at the top level of the Object
    breeds = Object.entries(dogBreeds.message)
    createDogBreeds(breeds)
  })
}

function createDogBreeds(breeds) {
  for (breed of breeds) {
    if (breed[1].length === 0) {
      //const newBreed = new Breed(breed.shift());
      console.log(breed.shift())
    } else if (breed[1].length === 1) {
      let type = breed.shift()
      let subType = breed.pop()
      console.log(`${type}: ${subType}`)
      //const newBreed = new Breed(`${type} ${subType}`);
    } else {
      let type = breed.shift()
      let subType = breed.pop()
      for (const iterator of subType) {
        console.log(`${type}: ${iterator}`)
        //const newBreed = new Breed(`${type}: ${iterator}`)
      }
    }
  }
}

function likePost(event) {
  // preventDefault action
  event.preventDefault()

  const heart = event.target
  const postId = parseInt(heart.dataset.id)
  let likes = parseInt(event.currentTarget.parentElement.children[1].innerText)

  if (heart.innerText == EMPTY_HEART) {
    // Change the heart to a full heart
    heart.innerText = FULL_HEART
    // Add the .activated-heart class to make the heart appear red
    heart.setAttribute("class", "like activated-heart")
    // increase post num_of_likes
    likes += 1
    updateLikes(postId, likes)
  } else { // When a user clicks on a full heart
    // Change the heart back to an empty heart
    heart.innerText = EMPTY_HEART
    // Remove the .activated-heart class
    heart.removeAttribute("class", "activated-heart")
    heart.setAttribute("class", "like")
    // decrease post num_of_likes
    likes -= 1
    updateLikes(postId, likes)
  }
}

function updateLikes(postId, likes) {
  let bodyData = {
    id: postId,
    num_of_likes: likes
  };

  let configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(bodyData)
  };

  return fetch(`${endPoint}/${postId}`, configObj)
  .then(response => response.json())
  .then(postObject => {
    const box = document.getElementById(postObject.data.id)
    box.children[1].firstElementChild.children[1].innerText = postObject.data.attributes.num_of_likes
  })
}

function wantDog(event) {
  const dogBreedId = event.target.dataset.id
  const box = document.getElementById(`${dogBreedId}`)
  const adoptContainer = document.createElement("div")
  adoptContainer.innerText = "Dogs Available for Adoption"
  // fetch available dogs from rescuegroups.org api
  box.appendChild(adoptContainer)
}
