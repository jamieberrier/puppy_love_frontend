// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';

const key = "p289h86Kbr4EZ99HF10oH8aKiswniEUHSonNeHpGhSuDNCSgIJ";
const secret = "ykSeN25BWR4Igz7sAmk9brfKbTHMB1pAl4ntTNi4";

const postsEndPoint = "http://localhost:3000/api/v1/posts";
const breedsEndPoint = "http://localhost:3000/api/v1/breeds";

let breedFilter = false;
//let breedSelect = false;

document.addEventListener('DOMContentLoaded', () => {
  // add new post
  const addBtn = document.querySelector("#new-post-btn")
  addBtn.addEventListener("click", renderNewPostForm)
  // load filter dropdown
  populateBreedFilter()
  // filter by breed dropdown
  const filterBreed = document.querySelector("#breed-filter")
  filterBreed.addEventListener("click", toggleBreedFilter)
  // fetch and load posts
  getPosts()
});

// Populate dropdown with breeds
function populateBreedFilter() {
  const breedContent = document.querySelector("#breed-content")

  fetch(breedsEndPoint)
  .then(response => response.json())
  .then(breeds => {
    for (const breed of breeds.data) {
      new Breed(breed);
      const option = document.createElement("a")
      option.setAttribute("class", "dropdown-item")
      option.setAttribute("id", `${breed.id}`)
      //option.setAttribute("value", `${breed.id}`)
      option.innerHTML = `${breed.attributes.name}`
      option.addEventListener("click", handleFilterClick)
      breedContent.appendChild(option)
    }
  })
  .catch(error => {
    console.log(error.message)
  })
}

// GET selected breed & its posts
function handleFilterClick(event) {
  const breedId = parseInt(event.target.id)
  const breed = Breed.findById(breedId)

  if (breed.posts.length > 0) {
    breed.renderBreedPosts()
  } else {
    alert("no posts")
  }
}

// Activate Filter Posts By Breed
function toggleBreedFilter(event) {
  const filterBreed = document.querySelector("#breed-filter")
  breedFilter = !breedFilter

  if (breedFilter) {
    filterBreed.setAttribute("class", "dropdown is-active")
  } else {
    filterBreed.setAttribute("class", "dropdown")
  }
}

// GET posts
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

// Populates select with dog breeds
function populateBreedSelect() {
  //const select = document.querySelector("#select-content")
  const select = document.querySelector("select")

  for (const breed of Breed.all) {
    //const option = document.createElement("a")
    const option = document.createElement("option")
  
    //option.setAttribute("class", "dropdown-item")
    option.setAttribute("id", `breed-${breed.id}`)
    option.setAttribute("value", `${breed.id}`)
    option.innerHTML = `${breed.name}`
    select.appendChild(option)
  }
}

// show form to create a new post
function renderNewPostForm() {
  const addBtn = document.querySelector("#new-post-btn")
  const newPostContainer = document.querySelector("#new-post-container")
  //const select = document.querySelector("#breeds")
  const closeBtn = document.querySelector("#close-form")

  //select.addEventListener("click", toggleSelectBreed)
  closeBtn.addEventListener("click", handleCloseForm)
  
  // hide add new post button
  addBtn.setAttribute("class", "is-hidden")
  // show new post form container
  newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4")
  // fetch options from Breed
  populateBreedSelect()
  // add submit event listener
  newPostContainer.addEventListener("submit", createPostHandler)
}
/*
function toggleSelectBreed(event) {
  const select = document.querySelector("#breeds")
  breedSelect = !breedSelect

  if (breedSelect) {
    select.setAttribute("class", "dropdown is-active")
  } else {
    select.setAttribute("class", "dropdown")
  }
}
*/
function handleCloseForm(event) {
  const addBtn = document.querySelector("#new-post-btn")
  const newPostContainer = document.querySelector("#new-post-container")
  // hide form container
  newPostContainer.setAttribute("class", "is-hidden")
  // show add button
  addBtn.setAttribute("class", "button is-danger is-outlined")
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
      const breed = Breed.findById(newPost.breed.id);
      breed.posts.push(newPost);
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
  const adoptContainer = document.createElement("article")
  adoptContainer.setAttribute("id", `adoption-container-${postId}`)
  adoptContainer.setAttribute("class", "message is-danger")
  // create header
  const adoptHeaderDiv = document.createElement("div")
  adoptHeaderDiv.setAttribute("class", "message-header heading is-size-5")
  const adoptHeader = document.createElement("p")
  adoptHeaderDiv.appendChild(adoptHeader)
  // create close button
  const closeBtn = document.createElement("button")
  closeBtn.setAttribute("class", "delete")
  closeBtn.setAttribute("aria-label", "delete")
  closeBtn.addEventListener("click", handleCloseAdoptionContainer)
  adoptHeaderDiv.appendChild(closeBtn)
  adoptContainer.appendChild(adoptHeaderDiv)
  // pluralize breed
  const breedPlural = pluralize(breed)

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
    if (!!dogs.animals) {
      // set header
      adoptHeader.innerText = `Adoptable ${breedPlural}`
      // add adoption div to post
      box.appendChild(adoptContainer)
      // get org info then render each adoptable dog
      dogs.animals.forEach(dog => {
        renderAdoptableDog(dog, postId)
      })
    } else { // no adoptable dog(s) found
      // set header
      adoptHeader.innerText = ` No Adoptable ${breedPlural}`
      // add adoption div to post
      box.appendChild(adoptContainer)
    }
  })
  .catch(error => {
    console.log(error.message)
    // set header
    adoptHeader.innerText = ` No Adoptable ${breedPlural}`
    // add adoption div to post
    box.appendChild(adoptContainer)
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
  const name = document.createElement("p")
  name.setAttribute("class", "has-text-danger is-size-5 mb-1")
  name.innerText = dog.name
  content.appendChild(name)
  // <p> for details
  const details = document.createElement("p")
  details.innerHTML = `${dog.age} ` + '<i class="fas fa-paw"></i>' + ` ${dog.gender} ` + '<i class="fas fa-paw"></i>' + ` ${dog.size}`
  content.appendChild(details)
  // <p> for location
  const location = document.createElement("p")
  location.innerHTML = '<i class="fas fa-map-marked-alt"></i>' + ` ${dog.contact.address.city}` + ', ' + `${dog.contact.address.state}`
  content.appendChild(location)
  // <p> for url
  const urlP = document.createElement("p")
  urlP.setAttribute("class", "has-text-link")
  // <a> for url
  const url = document.createElement("a")
  url.setAttribute("href", `${dog.url}`)
  url.setAttribute("target", "_blank")
  url.innerText = `Tell Me More About ${dog.name}!`
  urlP.appendChild(url)
  content.appendChild(urlP)
  // <p> for email
  //const emailP = document.createElement("p")
  //const emailS = document.createElement("span")
  //emailS.setAttribute("class", "icon")
  //const emailI = document.createElement("i")
  //emailI.setAttribute("class", "fas fa-envelope")
  //emailS.appendChild(emailI)
  //emailP.appendChild(emailS)
  // <a> for mailto
  //const mail = document.createElement("a")
  //if (dog.contact.email) {
  //  mail.setAttribute("href", `mailto:${dog.contact.email}`)
  //  mail.innerText = dog.contact.email
 // } else {
  //  mail.innerText = "No Email Address"
  //}
  //emailP.appendChild(mail)
  //content.appendChild(emailP)
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

// delete adoption container
function handleCloseAdoptionContainer(event) {
  const container = document.querySelector(`#${event.target.parentElement.parentElement.id}`)
  container.remove()
}