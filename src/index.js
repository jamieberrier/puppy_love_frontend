// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';

const endPoint = "http://localhost:3000/api/v1/posts";
const dogBreedEndPoint = "https://dog.ceo/api/breeds/list/all";

let addPost = false;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector("#new-post-btn")
  addBtn.addEventListener("click", renderNewPostForm)

  getPosts()
  //getBreeds()
});

// show form to create a new post
function renderNewPostForm() {
  const addBtn = document.querySelector("#new-post-btn")
  const newPostContainer = document.querySelector("#new-post-container")
  const newPostForm = document.querySelector("#new-post-form")

  addPost = !addPost;

  if (addPost) {
    // hide add button
    addBtn.setAttribute("class", "is-hidden")
    // show form container
    newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4")
    // breed field
    const breedField = document.createElement("div")
    breedField.setAttribute("class", "field")
    // breed label
    const breedLabel = document.createElement("label")
    breedLabel.setAttribute("class", "label heading")
    breedLabel.innerText = "Select Dog Breed"
    breedField.appendChild(breedLabel)
    // breed control
    const breedControl = document.createElement("div")
    breedControl.setAttribute("class", "control")
    breedField.appendChild(breedControl)
    // select breed
    const selectBreed = document.createElement("div")
    selectBreed.setAttribute("class", "select")
    //selectBreed.setAttribute("id", "select-breed")
    const select = document.createElement("select")
    select.setAttribute("id", "breeds")
    // select placeholder
    const option = document.createElement("option")
    option.setAttribute("value", "")
    option.setAttribute("disabled", "true")
    option.setAttribute("selected", "true")
    option.setAttribute("hidden", "true")
    option.innerHTML = "Select Dog Breed"
    select.appendChild(option)
    // fetch options from Breed
    populateBreedSelect()
    //const option = document.createElement("option")
    //option.innerHTML = "select"
    //select.appendChild(option)
    selectBreed.appendChild(select)
    breedField.appendChild(selectBreed)
    newPostForm.appendChild(breedField)
    // picture field
    const pictureField = document.createElement("div")
    pictureField.setAttribute("class", "field")
    // picture label
    const pictureLabel = document.createElement("label")
    pictureLabel.setAttribute("class", "label heading")
    pictureLabel.innerText = "Picture"
    pictureField.appendChild(pictureLabel)
    // picture control
    const pictureControl = document.createElement("div")
    pictureControl.setAttribute("class", "control")
    pictureField.appendChild(pictureControl)
    // picture input
    const pictureInput = document.createElement("input")
    pictureInput.setAttribute("class", "input")
    pictureInput.setAttribute("id", "input-picture")
    pictureInput.setAttribute("type", "text")
    pictureInput.setAttribute("placeholder", "Enter Picture URL")
    pictureControl.appendChild(pictureInput)
    newPostForm.appendChild(pictureField)
    // submit field
    const submitField = document.createElement("div")
    submitField.setAttribute("class", "field")
    // submit control
    const submitControl = document.createElement("div")
    submitControl.setAttribute("class", "control")
    submitField.appendChild(submitControl)
    // submit button
    const submitBtn = document.createElement("button")
    submitBtn.setAttribute("class", "button is-danger is-light")
    submitBtn.setAttribute("type", "submit")
    submitBtn.innerText = "Create Love"
    submitControl.appendChild(submitBtn)
    newPostForm.appendChild(submitField)
    // submit
    newPostForm.addEventListener("submit", addNewPost)
  }
}

// POST request
function addNewPost(event) {
  event.preventDefault()

  const newPostContainer = document.querySelector("#new-post-container")
  const addBtn = document.querySelector("#new-post-btn")
  // hide form container
  newPostContainer.setAttribute("class", "is-hidden")
  // show add button
  addBtn.setAttribute("class", "button is-danger is-outlined")
  //debugger
  const picture = document.querySelector("#input-picture").value
  const breed_id = parseInt(document.querySelector("#breeds").value)

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

  return fetch(endPoint, configObj)
  .then(response => response.json())
  .then(post => {
    //if (post.errors) {
      //alert(post.errors)
    //} else {
      const newPost = new Post(post.data);
      newPost.renderPost();
      alert("Puppy Love Added!")
    //}
  })
}

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

// GET request
// populates select with dog breeds
function populateBreedSelect() {
  fetch("http://localhost:3000/api/v1/breeds")
  .then(response => response.json())
  .then(breeds => {
    const select = document.querySelector("select")
    for (const breed of breeds.data) {
      const option = document.createElement("option")
      option.setAttribute("id", `${breed.id}`)
      option.setAttribute("value", `${breed.id}`)
      option.innerHTML = `${breed.attributes.name}`
      select.appendChild(option)
    }
  })
}

/*
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
*/
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

// updates the number of likes for a post
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
  .then(post => {
    const box = document.getElementById(post.data.id)
    box.children[1].firstElementChild.children[1].innerText = post.data.attributes.num_of_likes
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
