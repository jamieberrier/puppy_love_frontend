// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';

const endPoint = "http://localhost:3000/api/v1/posts";
//const dogBreedEndPoint = "https://dog.ceo/api/breeds/list/all";

let addPost = false;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector("#new-post-btn")
  addBtn.addEventListener("click", renderNewPostForm)
  // fetch and load posts
  getPosts()
  //getBreeds()
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

// GET request
// populates select with dog breeds
function populateBreedSelect() {
  fetch("http://localhost:3000/api/v1/breeds")
  .then(response => response.json())
  .then(breeds => {
    const select = document.querySelector("select")
    for (const breed of breeds.data) {
      const option = document.createElement("option")
      //option.setAttribute("class", "option")
      option.setAttribute("id", `${breed.id}`)
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
  const newPostForm = document.querySelector("#new-post-form")

  addPost = !addPost;

  if (addPost) {
    // hide add button
    addBtn.setAttribute("class", "is-hidden")
    //addBtn.style.display = "none";
    // show form container
    newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4")
    //newPostContainer.style.display = "block";
    // header field
    const headerField = document.createElement("div")
    headerField.setAttribute("class", "field")
    // header control
    const headerControl = document.createElement("div")
    headerControl.setAttribute("class", "control")
    headerField.appendChild(headerControl)
    // header
    const header = document.createElement("h3")
    header.setAttribute("class", "heading has-text-danger is-size-4")
    header.innerText = "Add Puppy Love!"
    headerControl.appendChild(header)
    newPostForm.appendChild(headerField)
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
    newPostContainer.addEventListener("submit", addNewPost)
  } else {
    //newPostContainer.style.display = "none";
    newPostContainer.setAttribute("class", "is-hidden")
  }
}

// POST request
function addNewPost(event) {
  event.preventDefault()

  const newPostContainer = document.querySelector("#new-post-container")
  const addBtn = document.querySelector("#new-post-btn")
  // hide form container
  newPostContainer.setAttribute("class", "is-hidden")
  //newPostContainer.style.display = "none";
  // show add button
  addBtn.setAttribute("class", "button is-danger is-outlined")
  //addBtn.style.display = "block";
  //addBtn.style = "text-align:center";

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
    console.log(post)
    
    if (post.errors) {
      alert(post.errors)
    } else {
      const newPost = new Post(post.data);
      newPost.renderPost();
      // reset form
      document.querySelector("#new-post-form").reset();
      alert("Thanks For The Love!")
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
  // fetch available dogs from rescuegroups.org api
  fetchAdoptions(breed, postId)
}

// fetch available dogs from rescuegroups.org api
function fetchAdoptions(breed, postId) {
  const wantOne = document.querySelector(`#want-one-${postId}`)
  const page = document.querySelector("html")
  const box = document.getElementById(`${postId}`)
  // create container for adoptable dogs
  const adoptContainer = document.createElement("div")
  adoptContainer.setAttribute("id", `adoption-container-${postId}`)
  adoptContainer.setAttribute("class", "container")
  const adoptHeader = document.createElement("h3")
  adoptHeader.setAttribute("class", "heading is-size-5")
  adoptContainer.appendChild(adoptHeader)

  let configObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Authorization": "uzRpR0sN"
    }
  };

  return fetch ("https://api.rescuegroups.org/v5/public/animals/search/available/dogs", configObj)
  .then(response => response.json())
  .then(dogs => {
    // change back text color & cursor
    wantOne.setAttribute("class", "has-text-danger level-item like")
    page.style.cursor = "auto"
    // get adoptable dogs that match breed in picture
    const adoptableDogs = dogs.data.filter(dog => dog.attributes.breedString.includes(`${breed}`))
    // if adoptable dog(s) found
    if (adoptableDogs.length > 0) {
      // set header
      adoptHeader.innerText = `Adoptable ${breed}s`
      // add adoption div to post
      box.appendChild(adoptContainer)
      // get org info then render each adoptable dog
      adoptableDogs.forEach(dog => {
        // get organization id
        const orgId = dog.relationships.orgs.data[0].id
        // get organization info from rescuegroups.org api
        fetchOrgInfo(orgId, dog, postId)
      })
    } else { // no adoptable dog(s) found
      // set header
      adoptHeader.innerText = ` No Adoptable ${breed}s`
      // add adoption div to post
      box.appendChild(adoptContainer)
    }
  })
  .catch(error => {
    console.log("inside fetchAdoptions")
    alert(error.message)
  })
}

// GET organization info fromn rescuegroups.org api
function fetchOrgInfo(orgId, dog, postId) {
  let configObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Authorization": "uzRpR0sN"
    }
  };

  fetch (`https://api.rescuegroups.org/v5/public/orgs/${orgId}`, configObj)
  .then(response => response.json())
  .then(org => {
    const orgName = org.data[0].attributes.name
    const orgUrl = org.data[0].attributes.url
    renderAdoptableDog(dog, orgName, orgUrl, postId)
  })
  .catch(error => {
    console.log("inside fetchOrgInfo")
    alert(error.message)
  })
}

// generate html for each adoptable dog and append to adoptContainer
function renderAdoptableDog(dog, orgName, url, postId) {
  const adoptContainer = document.querySelector(`#adoption-container-${postId}`)
  const dogDiv = document.createElement("article")
  dogDiv.setAttribute("class", "media")
  // media-left
  const figure = document.createElement("figure");
  figure.setAttribute("class", "media-left")
  const picP = document.createElement("p")
  picP.setAttribute("class", "image is-64x64")
  const pic = document.createElement("img")
  pic.src = dog.attributes.pictureThumbnailUrl
  picP.appendChild(pic)
  figure.appendChild(picP)
  dogDiv.appendChild(figure)
  // media-content
  const mediaContent = document.createElement("div")
  mediaContent.setAttribute("class", "media-content")
  const content = document.createElement("div")
  content.setAttribute("class", "content")
  // <p> for org url
  const orgP = document.createElement("p")
  // <a> for org url
  const orgUrl = document.createElement("a")
  orgUrl.setAttribute("href", `${url}`)
  orgUrl.innerText = orgName
  orgP.appendChild(orgUrl)
  content.appendChild(orgP)
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

// GET dog breeds from dogceo api
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