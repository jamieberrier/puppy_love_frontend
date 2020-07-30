// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';

const key = "p289h86Kbr4EZ99HF10oH8aKiswniEUHSonNeHpGhSuDNCSgIJ";
const secret = "ykSeN25BWR4Igz7sAmk9brfKbTHMB1pAl4ntTNi4";

const postsEndPoint = "http://localhost:3000/api/v1/posts";
const breedsEndPoint = "http://localhost:3000/api/v1/breeds";

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector("#new-post-btn")
  addBtn.addEventListener("click", renderNewPostForm)
  // fetch and load posts
  getPosts()
});

// GET request
function getPosts() {
  fetch(postsEndPoint)
  .then(response => response.json())
  .then(posts => {
    posts.data.forEach(post => {
      const newPost = new Post(post);
      newPost.renderPost();
    })
  });
}

// GET request
// populates select with dog breeds
function populateBreedSelect() {
  fetch(breedsEndPoint)
  .then(response => response.json())
  .then(breeds => {
    const select = document.querySelector("select")
    for (const breed of breeds.data) {
      const option = document.createElement("option")
      //option.setAttribute("class", "option")
      option.setAttribute("id", `breed-${breed.id}`)
      option.setAttribute("value", `${breed.id}`)
      option.innerHTML = `${breed.attributes.name}`
      select.appendChild(option)
    }
  })
}

// show form to create a new post
function renderNewPostForm() {
  const addBtn = document.querySelector("#new-post-btn")
  const newPostContainer = document.querySelector("#new-post-container")
  
  // hide add new post button
  addBtn.setAttribute("class", "is-hidden")
  // show new post form container
  newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4")
  // fetch options from Breed
  populateBreedSelect()
  // add submit event listener
  newPostContainer.addEventListener("submit", createPostHandler)
}

// new post submit event handler
function createPostHandler(event) {
  event.preventDefault()

  const picture = document.querySelector("#input-picture").value
  const breedId = parseInt(document.querySelector("#breeds").value)

  addPostFetch(picture, breedId)
}

// POST request
function addPostFetch(picture, breed_id) {
  let bodyData = {
    picture,
    breed_id,
    num_of_likes: 0
  };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(bodyData)
  };

  return fetch(postsEndPoint, configObj)
  .then(response => response.json())
  .then(post => {
    // handle validation errors
    if (post.errors) {
      alert(post.errors)
    } else {
      const newPostContainer = document.querySelector("#new-post-container")
      const addBtn = document.querySelector("#new-post-btn")
      // hide form container
      newPostContainer.setAttribute("class", "is-hidden")
      // show add button
      addBtn.setAttribute("class", "button is-danger is-outlined")
      // create confirmation
      alert("Thanks For The Love!")
      const newPost = new Post(post.data);
      newPost.renderPost();
      // reset form
      document.querySelector("#new-post-form").reset();
    }
  })
  .catch(error => {
    alert(error.message)
  })
}

function likePost(event) {
  // preventDefault action
  event.preventDefault()

  const heart = event.target
  const postId = parseInt(heart.dataset.id)
  let likes = parseInt(event.currentTarget.parentElement.children[1].innerText)
  const p = Post.findById(postId)

  if (heart.innerText == EMPTY_HEART) {
    // Change the heart to a full heart
    heart.innerText = FULL_HEART
    // Add the .activated-heart class to make the heart appear red
    heart.setAttribute("class", "like activated-heart")
    // increase post num_of_likes
    likes += 1
    p.updateLikes(likes)
  } else { // When a user clicks on a full heart
    // Change the heart back to an empty heart
    heart.innerText = EMPTY_HEART
    // Remove the .activated-heart class
    heart.removeAttribute("class", "activated-heart")
    heart.setAttribute("class", "like")
    // decrease post num_of_likes
    likes -= 1
    p.updateLikes(likes)
  }
}

// handle click on "I Want One!"
function wantDog(event) {
  // change cursor to wait
  const page = document.querySelector("html")
  page.style.cursor = "wait"
  // change text color
  event.target.setAttribute("class", "has-text-primary level-item")
  const postId = event.target.dataset.postId
  const breed = event.target.dataset.breed
  // fetch token to fetch available dogs from petfinder api
  fetchPetFinderToken(breed, postId)
}

function fetchPetFinderToken(breed, postId) {
  // This is a POST request, because we need the API to generate a new token for us
  let configObjT = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=client_credentials&client_id=${key}&client_secret=${secret}`
  };

  fetch("https://api.petfinder.com/v2/oauth2/token", configObjT)
  .then(response => response.json())
  .then(tokenInfo => {
    const tokenType = tokenInfo.token_type
    const token = tokenInfo.access_token
    fetchAdoptableDogs(breed, postId, tokenType, token)
  })
  .catch(error => {
    console.log("inside fetchPetFinderToken")
    alert(error.message)
  })
}

function fetchAdoptableDogs(breed, postId, tokenType, token) {
  const wantOne = document.querySelector(`#want-one-${postId}`)
  const page = document.querySelector("html")
  const box = document.querySelector(`#box-${postId}`)
  // create container for adoptable dogs
  const adoptContainer = document.createElement("div")
  adoptContainer.setAttribute("id", `adoption-container-${postId}`)
  adoptContainer.setAttribute("class", "container")
  const adoptHeader = document.createElement("h3")
  adoptHeader.setAttribute("class", "heading is-size-3")
  adoptContainer.appendChild(adoptHeader)

  let configObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `${tokenType} ${token}`
    }
  };
  
  return fetch (`https://api.petfinder.com/v2/animals?type=dog&breed=${breed}&status=adoptable&limit=100`, configObj)
  .then(response => response.json())
  .then(dogs => {
    // change back text color & cursor
    wantOne.setAttribute("class", "has-text-danger level-item like")
    page.style.cursor = "auto"
    
    // if adoptable dog(s) found
    if (dogs.animals.length > 0) {
      // set header
      adoptHeader.innerText = `Adoptable ${breed}s`
      // add adoption div to post
      box.appendChild(adoptContainer)
      // get org info then render each adoptable dog
      dogs.animals.forEach(dog => {
        renderAdoptableDog(dog, postId)
      })
    } else { // no adoptable dog(s) found
      // set header
      adoptHeader.innerText = ` No Adoptable ${breed}s`
      // add adoption div to post
      box.appendChild(adoptContainer)
    }
  })
  .catch(error => {
    console.log("inside fetchAdoptableDogs")
    alert(error.message)
  })
}

// generate html for each adoptable dog and append to adoptContainer
function renderAdoptableDog(dog, postId) {
  const adoptContainer = document.querySelector(`#adoption-container-${postId}`)
  const dogDiv = document.createElement("article")
  dogDiv.setAttribute("class", "media")
  // media-left
  const figure = document.createElement("figure");
  figure.setAttribute("class", "media-left mt-4 mb-4")
  const picP = document.createElement("p")
  picP.setAttribute("class", "image is-96x96")
  const pic = document.createElement("img")
  // if has primary photo
  if (dog.primary_photo_cropped != null) {
    pic.src = dog.primary_photo_cropped.medium
  } else {
    //pic.src = 'dog.svg'
    pic.src = "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48637918/1/?bust=1596122132&width=450"
  }
  picP.appendChild(pic)
  figure.appendChild(picP)
  dogDiv.appendChild(figure)
  // media-content
  const mediaContent = document.createElement("div")
  mediaContent.setAttribute("class", "media-content")
  const content = document.createElement("div")
  content.setAttribute("class", "content")
  // <p> for name
  const nameP = document.createElement("p")
  nameP.setAttribute("class", "heading has-text-danger is-size-5")
  nameP.innerText = dog.name
  content.appendChild(nameP)
  // <p> for url
  const urlP = document.createElement("p")
  // <a> for url
  const url = document.createElement("a")
  url.setAttribute("href", `${dog.url}`)
  url.setAttribute("target", "_blank")
  url.innerText = `Click To Learn More About ${dog.name}`
  urlP.appendChild(url)
  content.appendChild(urlP)
  // <p> for description
  const emailP = document.createElement("p")
  // <a> for mailto
  const mail = document.createElement("a")
  mail.setAttribute("href", `mailto:${dog.contact.email}`)
  mail.innerText = dog.contact.email
  emailP.appendChild(mail)
  content.appendChild(emailP)
  mediaContent.appendChild(content)
  dogDiv.appendChild(mediaContent)
  // media-right
  //const mediaRight = document.createElement("div")
  //mediaRight.setAttribute("class", "media-right")
  // // delete button
  //const deleteBtn = document.createElement("button")
  //deleteBtn.setAttribute("class", "delete")
  //deleteBtn.addEventListener("click", removeDog)
  //mediaRight.appendChild(deleteBtn)
  //dogDiv.appendChild(mediaRight)
  adoptContainer.appendChild(dogDiv)
}