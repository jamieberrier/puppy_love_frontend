// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';
// Defining end points
const TOKEN_END_POINT = "http://localhost:3000/api/v1/petfinder";
const POSTS_END_POINT = "http://localhost:3000/api/v1/posts";
const BREEDS_END_POINT = "http://localhost:3000/api/v1/breeds";
// Toggling is-active on 'filter by breed' dropdown menu
let filterByBreed = false;
// Toggling 'see all the love' & 'add new post' buttons and 'filter by breed' dropdown
let breedPosts = false;
// Petfinder API access token info
let token, tokenType, expires;

document.addEventListener('DOMContentLoaded', () => {
  // get modal
  getModal();
  // get 'filter by breed' dropdown and set to global variable
  window.breedFilter = document.querySelector("#breed-filter");
  // get 'show some love' button and set to global variable
  window.addBtn = document.querySelector("#new-post-btn");
  // get 'new post container' and set to global variable
  window.newPostContainer = document.querySelector("#new-post-container");
  // get 'posts container' and set to global variable
  window.postsContainer = document.querySelector("#posts-container");
  // add event listener to 'show some love' button
  addBtn.addEventListener("click", handleRenderForm);
  // load dog breeds in 'filter by breed' dropdown
  Breed.populateBreedFilter;
  // add event listener to 'filter by breed' dropdown
  breedFilter.addEventListener("click", handleToggleFilter);
  // fetch posts
  Post.fetchPosts;
});

// Getting modal elements and setting to global variables
function getModal() {
  // get modal
  window.modal = document.querySelector("#modal");
  // get modal background
  window.modalBg = document.querySelector("#modal-background");
  // get modal close button
  window.modalCloseBtn = document.querySelector("#modal-close");
  // get modal content
  window.modalContent = document.querySelector("#modal-content");
}

// Setting modal class to is-active and adding event listeners
function activateModal() {
  // add listener to modal background
  modalBg.addEventListener("click", (e) => modal.setAttribute("class", "modal"));
  // add listener to modal close button
  modalCloseBtn.addEventListener("click", (e) => modal.setAttribute("class", "modal"));
  // activate modal
  modal.setAttribute("class", "modal is-active is-clipped");
}

// Hiding / Showing 'see all the love' & 'add new post' buttons and 'filter by breed' dropdown
function toggleControls() {
  breedPosts = !breedPosts;
  // get 'see all the love' button
  const showAllBtn = document.querySelector("#all-posts-btn");
  // if displaying only posts of one breed
  if (breedPosts) {
    // hide 'filter by breed' dropdown
    breedFilter.parentElement.setAttribute("class", "is-hidden");
    // hide 'show some love' button
    addBtn.parentElement.setAttribute("class", "is-hidden");
    // show 'see all the love' button
    showAllBtn.parentElement.setAttribute("class", "content has-text-centered");
    // add listener to 'see all the love' button
    showAllBtn.addEventListener("click", handleShowAll);
  } else { // displaying all posts
    // show 'filter by breed' dropdown
    breedFilter.parentElement.setAttribute("class", "content has-text-centered");
    // hide 'see all the love' button
    showAllBtn.parentElement.setAttribute("class", "is-hidden");
    // show 'show some love' button
    addBtn.parentElement.setAttribute("class", "content has-text-centered");
  }
}

// Activating Filter Posts By Breed
function handleToggleFilter() {
  filterByBreed = !filterByBreed;
  // if filter is not currently displayed
  if (filterByBreed) {
    // activate dropdown
    breedFilter.setAttribute("class", "dropdown is-active");
  } else { // filter is currently displayed
    // deactivate dropdown
    breedFilter.setAttribute("class", "dropdown");
  }
}

// Rendering posts of the selected dog breed
function handleFilterClick(event) {
  const breedId = parseInt(event.target.id);
  const breed = Breed.findById(breedId);
  // pluralize breed
  const breedPlural = pluralize(breed.name);
  // if posts of the breed exist
  if (breed.posts.length > 0) {
    // hide 'filter by breed' dropdown, hide 'show some love' button, and show 'see all the love' button & add listener
    toggleControls();
    // render each post for the selected dog breed
    breed.renderBreedPosts;
  } else { // display modal
    // set modal text
    modalContent.innerText = `There are no posts of ${breedPlural}`;
    // activate modal
    activateModal();
  }
}

// Handling show all posts click event - render posts of the other dog breeds
function handleShowAll() {
  // get the fitlered breed's id
  const breedId = parseInt(postsContainer.firstChild.dataset.breedId);
  // get the posts of the other dog breeds
  const otherPosts = Post.all.filter(post => post.breed.id != breedId);
  // iterate over the other breeds' posts and render each post
  otherPosts.forEach(post => post.renderPost);
  // show 'filter by breed' dropdown, hide 'see all the love' button, and show 'show some love' button
  toggleControls();
}

// Showing form to create a new post
function handleRenderForm() {
  // add event listener to 'close form' button
  document.querySelector("#close-form").addEventListener("click", handleCloseForm);
  // hide 'show some love' button
  addBtn.setAttribute("class", "is-hidden");
  // show 'new post form' container
  newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4");
  // populate select options
  Breed.populateBreedSelect;
  // add submit event listener to 'new post' form
  document.querySelector("#new-post-form").addEventListener("submit", handleCreatePost);
}

// Handling close form click event
function handleCloseForm() {
  // hide 'new post form' container
  newPostContainer.setAttribute("class", "is-hidden");
  // show 'show some love' button
  addBtn.setAttribute("class", "button is-medium is-fullwidth is-danger is-outlined");
}

// Handling new post submit event
function handleCreatePost(event) {
  // prevent default action
  event.preventDefault();
  // get user entered values from form
  const picture = document.querySelector("#input-picture").value;
  const breedId = parseInt(document.querySelector("#breeds").value);
  // create new post
  Post.createNewPost(picture, breedId);
}

// Handling like post click event
function handleLikePost(event) {
  // get heart
  const heart = event.target;
  // get post id
  const postId = parseInt(heart.dataset.id);
  // get new number of likes
  let likes = parseInt(event.currentTarget.parentElement.children[1].innerText);
  // get post
  const post = Post.findById(postId);
  // user clicks on an empty heart
  if (heart.innerText == EMPTY_HEART) {
    // change the heart to a full heart
    heart.innerText = FULL_HEART;
    // make the heart red
    heart.setAttribute("class", "like has-text-danger");
    // increase post num_of_likes
    likes += 1;
  } else { // user clicks on a full heart
    // change the heart back to an empty heart
    heart.innerText = EMPTY_HEART;
    // make the heart outlined
    heart.setAttribute("class", "like");
    // decrease post num_of_likes
    likes -= 1;
  }
  // update post
  post.updateLikes(likes);
}

// Handling "I Want One!" click event
function handleWantDog(event) {
  // change cursor to wait
  const page = document.querySelector("html");
  page.style.cursor = "wait";
  // make 'I Want One' button static and change color during wait
  event.target.setAttribute("class", "level-item button is-static is-success is-light is-rounded");
  // get post id
  const postId = parseInt(event.target.dataset.postId);
  // get dog breed
  const breed = event.target.dataset.breed;
  // get post
  const post = Post.findById(postId);
  // if access token is undefined or expired, get a new one
  if (!expires || expires - new Date().getTime() < 1) {
    fetchPetFinderToken().then(() => {
      // then get adoptale dogs of the breed in the post
      post.fetchAdoptableDogs(breed);
    });
  } else { // get adoptale dogs of the breed in the post
    post.fetchAdoptableDogs(breed);
  }
}

// Fetching petfinder access token
// // GET request - petfinder API access token
function fetchPetFinderToken() {
  // GET /api/v1/petfinder
  return fetch(TOKEN_END_POINT)
  .then(response => response.json())
  .then(tokenInfo => {
    token = tokenInfo.token;
    tokenType = tokenInfo.token_type;
    // Unix timestamp for when the token expires = (Unix timestamp of the current time, in milliseconds) + (amount of time the token is good for in seconds, converted to milliseconds)
    expires = new Date().getTime() + (tokenInfo.expires * 1000);
  })
  .catch(error => alert(error.message));
}