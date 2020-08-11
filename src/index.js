// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';
// Defining end points
const TOKEN_END_POINT = "http://localhost:3000/api/v1/petfinder";
const POSTS_END_POINT = "http://localhost:3000/api/v1/posts";
const BREEDS_END_POINT = "http://localhost:3000/api/v1/breeds";
// Toggling is-active on filter by breed dropdown menu
let filterByBreed = false;

document.addEventListener('DOMContentLoaded', () => {
  // get modal
  getModal()
  // get 'filter by breed' dropdown and set to global variable
  window.breedFilter = document.querySelector("#breed-filter")
  // get 'show some love' button and set to global variable
  window.addBtn = document.querySelector("#new-post-btn")
  // get 'new post container' and set to global variable
  window.newPostContainer = document.querySelector("#new-post-container")
  // get 'posts container' and set to global variable
  window.postsContainer = document.querySelector("#posts-container")
  // add event listener to 'show some love' button
  addBtn.addEventListener("click", renderNewPostForm)
  // load dog breeds in 'filter by breed' dropdown
  populateBreedFilter()
  // add event listener to 'filter by breed' dropdown
  breedFilter.addEventListener("click", toggleBreedFilter)
  // fetch posts
  Post.fetchPosts()
});

// Getting modal elements and setting to global variables
function getModal() {
  // get modal
  window.modal = document.querySelector("#modal")
  // get modal background
  window.modalBg = document.querySelector("#modal-background")
  // get modal close button
  window.modalCloseBtn = document.querySelector("#modal-close")
  // get modal content
  window.modalContent = document.querySelector("#modal-content")
}

// Setting modal class to is-active and adding event listeners
function activateModal() {
  // add listener to modal background
  modalBg.addEventListener("click", (e) => {
    modal.setAttribute("class", "modal")
  })
  // add listener to modal close button
  modalCloseBtn.addEventListener("click", (e) => {
    modal.setAttribute("class", "modal")
  })
  // activate modal
  modal.setAttribute("class", "modal is-active is-clipped")
}

// Populating dropdown menu with dog breeds
// // GET request - all dog breeds
function populateBreedFilter() {
  // get 'filter by breed' dropdown menu content
  const breedContent = document.querySelector("#breed-content")

  fetch(BREEDS_END_POINT)
  .then(response => response.json())
  .then(breeds => {
    for (const breed of breeds.data) {
      // create new breed object instance
      new Breed(breed);
      // create breed <a>
      const option = document.createElement("a")
      option.setAttribute("class", "dropdown-item")
      option.setAttribute("id", `${breed.id}`)
      option.innerHTML = `${breed.attributes.name}`
      // add event listener to breed name
      option.addEventListener("click", handleFilterClick)
      breedContent.appendChild(option)
    }
  })
  .catch(error => {
    console.log(error.message)
  })
}

// Activating Filter Posts By Breed
function toggleBreedFilter(event) {
  filterByBreed = !filterByBreed

  if (filterByBreed) {
    breedFilter.setAttribute("class", "dropdown is-active")
  } else {
    breedFilter.setAttribute("class", "dropdown")
  }
}

// Rendering posts of the selected dog breed
function handleFilterClick(event) {
  const breedId = parseInt(event.target.id)
  const breed = Breed.findById(breedId)
  // pluralize breed
  const breedPlural = pluralize(breed.name)
  // if posts of the breed exist
  if (breed.posts.length > 0) {
    // get 'see all the love' button
    const showAllBtn = document.querySelector("#all-posts-btn")
    // render each post for the selected dog breed
    breed.renderBreedPosts()
    // hide 'filter by breed' dropdown
    breedFilter.parentElement.setAttribute("class", "is-hidden")
    // show 'see all the love' button
    showAllBtn.parentElement.setAttribute("class", "content has-text-centered")
    // add listener to 'see all the love' button
    showAllBtn.addEventListener("click", handleShowAll)
  } else { // display modal
    // set modal text
    modalContent.innerText = `There are no posts of ${breedPlural}`
    // activate modal
    activateModal()
  }
}

// Handling show all posts click event - render posts of the other dog breeds
function handleShowAll(event) {
  // get 'see all the love' button
  const showAllBtn = document.querySelector("#all-posts-btn")
  // get the fitlered breed's id
  const breedId = parseInt(postsContainer.firstChild.dataset.breedId)
  // get the posts of the other dog breeds
  const otherPosts = Post.all.filter(post => post.breed.id != breedId)
  // iterate over the other breeds' posts
  otherPosts.forEach(post => {
    // render each post
    post.renderPost()
  })
  // show 'filter by breed' dropdown
  breedFilter.parentElement.setAttribute("class", "content has-text-centered")
  // hide 'see all the love' button
  showAllBtn.parentElement.setAttribute("class", "is-hidden")
  // show 'show some love' button
  addBtn.parentElement.setAttribute("class", "content has-text-centered")
}

// Showing form to create a new post
function renderNewPostForm() {
  // get 'close form button'
  const closeBtn = document.querySelector("#close-form")
  // add listener to 'close form button'
  closeBtn.addEventListener("click", handleCloseForm)
  // hide 'show some love' button
  addBtn.setAttribute("class", "is-hidden")
  // show 'new post form container'
  newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4")
  // populate select options from Breed.all
  Breed.populateBreedSelect()
  // add submit event listener
  newPostContainer.addEventListener("submit", createPostHandler)
}

// Handling close form click event
function handleCloseForm(event) {
  // hide new post form container
  newPostContainer.setAttribute("class", "is-hidden")
  // show 'show some love' button
  addBtn.setAttribute("class", "button is-medium is-fullwidth is-danger is-outlined")
}

// Handling new post submit event
function createPostHandler(event) {
  event.preventDefault()

  const picture = document.querySelector("#input-picture").value
  const breedId = parseInt(document.querySelector("#breeds").value)

  addNewPost(picture, breedId)
}

// Creating a new post
// // POST request - create new post
function addNewPost(picture, breed_id) {
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

  fetch(POSTS_END_POINT, configObj)
  .then(response => response.json())
  .then(post => {
    // display validation errors
    if (post.errors) {
      // customize error message(s)
      const errorMessages = post.errors.map(element => {
        if (element.includes("Breed")) {
          return element = "Please Select a Dog Breed"
        } else {
          return element = "Please Add a Picture"
        }
      })
      // set modal text
      if (errorMessages.length === 2) {
        modalContent.innerText = `${errorMessages[0]} \n & \n ${errorMessages[1]}`
      } else {
        modalContent.innerText = `${errorMessages[0]}`
      }
      // activate modal
      activateModal()
    } else {
      // hide 'new post form container'
      newPostContainer.setAttribute("class", "is-hidden")
      // show 'show some love' button
      addBtn.setAttribute("class", "button is-medium is-fullwidth is-danger is-outlined")
      // create new post
      const newPost = new Post(post.data);
      // find breed by id
      const breed = Breed.findById(newPost.breed.id);
      // push new post onto breed's posts
      breed.posts.push(newPost);
      // render new post
      newPost.renderPost();
      // reset form
      document.querySelector("#new-post-form").reset();
      // set modal text
      modalContent.innerText = "Thanks For The Love!"
      // activate modal
      activateModal()
    }
  })
  .catch(error => {
    alert(error.message)
  })
}

// Handling like post click event
function likePost(event) {
  // get heart
  const heart = event.target
  // get post id
  const postId = parseInt(heart.dataset.id)
  // get new number of likes
  let likes = parseInt(event.currentTarget.parentElement.children[1].innerText)
  // get post
  const post = Post.findById(postId)

  // user clicks on an empty heart
  if (heart.innerText == EMPTY_HEART) {
    // change the heart to a full heart
    heart.innerText = FULL_HEART
    // make the heart red
    heart.setAttribute("class", "like has-text-danger")
    // increase post num_of_likes
    likes += 1
    // update post
    post.updateLikes(likes)
  } else { // user clicks on a full heart
    // change the heart back to an empty heart
    heart.innerText = EMPTY_HEART
    // make the heart outlined
    heart.setAttribute("class", "like")
    // decrease post num_of_likes
    likes -= 1
    // update post
    post.updateLikes(likes)
  }
}

// Handling "I Want One!" click event
async function wantDog(event) {
  // change cursor to wait
  const page = document.querySelector("html")
  page.style.cursor = "wait"
  // make 'I Want One' button static and change color during wait
  event.target.setAttribute("class", "level-item button is-static is-success is-light is-rounded")
  // get post id
  const postId = parseInt(event.target.dataset.postId)
  // get dog breed
  const breed = event.target.dataset.breed
  // get post
  const post = Post.findById(postId)
  // get token to fetch available dogs from petfinder api
  const token = await fetchPetFinderToken();
  // get adoptale dogs of the same breed as the post from petfinder API
  post.fetchAdoptableDogs(breed, token)
}

// Fetching petfinder access token
// // GET request
function fetchPetFinderToken() {
  return fetch(TOKEN_END_POINT)
  .then(response => response.json())
  .then(tokenInfo => {
    return tokenInfo.token
  })
  .catch(error => {
    console.log("inside fetchPetFinderToken")
    alert(error.message)
  })
}