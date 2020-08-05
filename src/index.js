// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';
// Defining end points
const tokenEndPoint = "http://localhost:3000/api/v1/petfinder";
const postsEndPoint = "http://localhost:3000/api/v1/posts";
const breedsEndPoint = "http://localhost:3000/api/v1/breeds";
// to toggle is-active on filter by breed dropdown menu
let breedFilter = false;

document.addEventListener('DOMContentLoaded', () => {
  // new post button
  const addBtn = document.querySelector("#new-post-btn")
  // filter by breed dropdown
  const filterBreed = document.querySelector("#breed-filter")
  // add event listener to new post button
  addBtn.addEventListener("click", renderNewPostForm)
  // load dog breeds in filter by breed dropdown
  populateBreedFilter()
  // add event listener to filter by breed dropdown
  filterBreed.addEventListener("click", toggleBreedFilter)
  // fetch and render posts
  fetchPosts()
});

// Populating dropdown menu with dog breeds
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

// Rendering posts of the selected dog breed
function handleFilterClick(event) {
  const breedId = parseInt(event.target.id)
  const breed = Breed.findById(breedId)

  if (breed.posts.length > 0) {
    const dropdown = document.querySelector("#breed-filter")
    const resetBtn = document.querySelector("#all-posts-btn")
    // render each post for the selected dog breed
    breed.renderBreedPosts()
    // hide filter by breed dropdown
    dropdown.parentElement.setAttribute("class", "is-hidden")
    // show all posts button
    resetBtn.parentElement.setAttribute("class", "content has-text-centered")
    // add listener to show all posts button
    resetBtn.addEventListener("click", handleShowAll)
  } else {
    alert("no posts")
  }
}

// Handling show all posts click event - render posts of the other dog breeds
function handleShowAll(event) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  const dropdown = document.querySelector("#breed-filter")
  const resetBtn = document.querySelector("#all-posts-btn")
  const postContainer = document.querySelector("#post-container")
  // get the fitlered breed's id
  const breedId = parseInt(postContainer.firstChild.dataset.breedId)
  // get the posts of the other dog breeds
  const otherPosts = Post.all.filter(post => post.breed.id != breedId)
  // iterate over the other posts
  otherPosts.forEach(post => {
    // render each post
    post.renderPost()
  })
  // show filter by breed dropdown
  dropdown.parentElement.setAttribute("class", "content has-text-centered")
  // hide see all the love button
  resetBtn.parentElement.setAttribute("class", "content has-text-centered is-hidden")
}

// Activating Filter Posts By Breed
function toggleBreedFilter(event) {
  const filterBreed = document.querySelector("#breed-filter")
  breedFilter = !breedFilter

  if (breedFilter) {
    filterBreed.setAttribute("class", "dropdown is-active")
  } else {
    filterBreed.setAttribute("class", "dropdown")
  }
}

// GET request - all posts
function fetchPosts() {
  fetch(postsEndPoint)
  .then(response => response.json())
  .then(posts => {
    // for each post
    posts.data.forEach(post => {
      // create new post object
      const newPost = new Post(post);
      // render new post
      newPost.renderPost();
    })
  });
}

// Populating form select with dog breeds
function populateBreedSelect() {
  const select = document.querySelector("select")
  // for each breed
  for (const breed of Breed.all) {
    // create option
    const option = document.createElement("option")
    // set option id
    option.setAttribute("id", `breed-${breed.id}`)
    // set option value
    option.setAttribute("value", `${breed.id}`)
    // display breed name
    option.innerHTML = `${breed.name}`
    // add to select
    select.appendChild(option)
  }
}

// Showing form to create a new post
function renderNewPostForm() {
  const addBtn = document.querySelector("#new-post-btn")
  const newPostContainer = document.querySelector("#new-post-container")
  const closeBtn = document.querySelector("#close-form")
  // add listener to close button
  closeBtn.addEventListener("click", handleCloseForm)
  // hide add new post button
  addBtn.setAttribute("class", "is-hidden")
  // show new post form container
  newPostContainer.setAttribute("class", "container is-fluid has-text-centered mb-4")
  // populate select options from Breed
  populateBreedSelect()
  // add submit event listener
  newPostContainer.addEventListener("submit", createPostHandler)
}

// Handling close form click event
function handleCloseForm(event) {
  const addBtn = document.querySelector("#new-post-btn")
  const newPostContainer = document.querySelector("#new-post-container")
  // hide form container
  newPostContainer.setAttribute("class", "is-hidden")
  // show add button
  addBtn.setAttribute("class", "button is-danger is-outlined")
}

// Handling new post submit event
function createPostHandler(event) {
  event.preventDefault()

  const picture = document.querySelector("#input-picture").value
  const breedId = parseInt(document.querySelector("#breeds").value)

  addNewPost(picture, breedId)
}

// POST request - create new post
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

  return fetch(postsEndPoint, configObj)
  .then(response => response.json())
  .then(post => {
    // display validation errors
    if (post.errors) {
      alert(post.errors)
    } else {
      const newPostContainer = document.querySelector("#new-post-container")
      const addBtn = document.querySelector("#new-post-btn")
      // hide form container
      newPostContainer.setAttribute("class", "is-hidden")
      // show add button
      addBtn.setAttribute("class", "button is-danger is-outlined")
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
      // create confirmation
      alert("Thanks For The Love!")
    }
  })
  .catch(error => {
    alert(error.message)
  })
}

// Handling like post click event
function likePost(event) {
  // preventDefault action
  event.preventDefault()

  const heart = event.target
  const postId = parseInt(heart.dataset.id)
  let likes = parseInt(event.currentTarget.parentElement.children[1].innerText)
  const post = Post.findById(postId)

  if (heart.innerText == EMPTY_HEART) {
    // Change the heart to a full heart
    heart.innerText = FULL_HEART
    // Add the .activated-heart class to make the heart appear red
    heart.setAttribute("class", "like activated-heart")
    // increase post num_of_likes
    likes += 1
    post.updateLikes(likes)
  } else { // When a user clicks on a full heart
    // Change the heart back to an empty heart
    heart.innerText = EMPTY_HEART
    // Remove the .activated-heart class
    heart.removeAttribute("class", "activated-heart")
    heart.setAttribute("class", "like")
    // decrease post num_of_likes
    likes -= 1
    post.updateLikes(likes)
  }
}

// Handling "I Want One!" click event
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

// POST request - generate a new token from petfinder API
function fetchPetFinderToken(breed, postId) {
  fetch(tokenEndPoint)
  .then(response => response.json())
  .then(tokenInfo => {
    const tokenType = tokenInfo.token_type
    const token = tokenInfo.token
    fetchAdoptableDogs(breed, postId, tokenType, token)
  })
  .catch(error => {
    console.log("inside fetchPetFinderToken")
    alert(error.message)
  })
}

// GET request - adoptale dogs of the same breed as the post from petfinder API
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
  // add listener to close button
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

// Generating HTML for each adoptable dog and appending to adoptContainer
function renderAdoptableDog(dog, postId) {
  const adoptContainer = document.querySelector(`#adoption-container-${postId}`)
  const dogDiv = document.createElement("article")
  dogDiv.setAttribute("class", "media")
  // media-left
  const figure = document.createElement("figure");
  figure.setAttribute("class", "media-left mt-4 mb-4")
  // <p> for picture
  const picP = document.createElement("p")
  picP.setAttribute("class", "image is-96x96")
  const pic = document.createElement("img")
  // if has primary photo
  if (dog.primary_photo_cropped != null) {
    pic.src = dog.primary_photo_cropped.medium
  } else {
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
  mediaContent.appendChild(content)
  dogDiv.appendChild(mediaContent)
  adoptContainer.appendChild(dogDiv)
}

// Handling delete adoption container event
function handleCloseAdoptionContainer(event) {
  const container = document.querySelector(`#${event.target.parentElement.parentElement.id}`)
  container.remove()
}