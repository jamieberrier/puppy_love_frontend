// Defining text characters for the empty and full heart
const EMPTY_HEART = '♡';
const FULL_HEART = '♥';

const endPoint = "http://localhost:3000/api/v1/posts";
const dogBreedEndPoint = "https://dog.ceo/api/breeds/list/all";

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
      alert("Puppy Love Added!")
      // reset form
      document.querySelector("#new-post-form").reset();
    }
  })
  .catch(error => {
    alert(error.message)
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
  // change text color & cursor
  event.target.setAttribute("class", "has-text-primary level-item wait")
  const postId = event.target.dataset.id
  const breed = event.target.dataset.breed
  // fetch available dogs from rescuegroups.org api
  fetchAdoptions(breed, postId)
}

// fetch available dogs from rescuegroups.org api
function fetchAdoptions(breed, postId) {
  const wantOne = document.querySelector("p.wait")
  const box = document.getElementById(`${postId}`)
  const adoptContainer = document.createElement("div")
  adoptContainer.setAttribute("id", `adoption-container-${postId}`)
  adoptContainer.setAttribute("class", "container")
  const adoptHeader = document.createElement("h3")
  adoptHeader.setAttribute("class", "heading is-size-5")
  adoptContainer.appendChild(adoptHeader)
  
  //FIELD
  // // SCHEMA - ATTRIBUTE
  // // animals - pictureThumbnailUrl
  // // animals - breedString
  // //organizations - adoptionUrl

  //let filters = [fieldName => "animalSpecies", 
  //operation => "equals",
  //criteria => "dog"]

  //let bodyData = {
    //"filters": [
      //{
      //  "fieldName": "breedString",
      //  "operation": "contains",
      //  "criteria": "Terrier"
      //}              
    //]
  //};

  let configObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/vnd.api+json",
      "Authorization": "uzRpR0sN"
    }
    //body: JSON.stringify(bodyData)
  };
  return fetch ("https://api.rescuegroups.org/v5/public/animals/search/available/dogs?&fields[organizations]=adoptionUrl", configObj)
  .then(response => response.json())
  .then(dogs => {
    wantOne.setAttribute("class", "has-text-danger level-item")
    const matchedDogs = dogs.data.filter(dog => dog.attributes.breedString.includes(`${breed}`))
    //renderMatchedDogs(matchedDogs)
    if (matchedDogs.length > 0) {
      matchedDogs.forEach(dog => {
        adoptHeader.innerText = `Adoptable ${breed}s`
        box.appendChild(adoptContainer)
        const orgId = dog.relationships.orgs.data[0].id
        fetchOrgUrl(orgId, dog, postId)
      })
      // dogs.data[0].attributes.breedString
      // => "Pit Bull Terrier / Labrador Retriever / Mixed (short coat)"
    } else {
      adoptHeader.innerText = ` No Adoptable ${breed}s`
      box.appendChild(adoptContainer)
    }
  })
  .catch(error => alert(error.message))
}
/*
function renderMatchedDogs(dogs) {  
  dogs.forEach(dog => {
    const orgId = dog.relationships.orgs.data[0].id
    fetchOrgUrl(orgId, dog)
  })
}
*/
function fetchOrgUrl(orgId, dog, postId) {
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
    renderDog(dog, orgName, orgUrl, postId)
  })
  .catch(error => alert(error.message))
}

 // generate html for each adoptable dog and append to adoptContainer
function renderDog(dog, orgName, url, postId) {
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
  //mediaRight.appendChild(deleteBtn)
  //dogDiv.appendChild(mediaRight)
  adoptContainer.appendChild(dogDiv)
}
/*
ATTRIBUTES
activityLevel: "Slightly Active"
adoptionFeeString: "225.00"
adultSexesOk: "All"
ageGroup: "Senior"
ageString: "11 Years 2 Months"
availableDate: "2016-06-01T00:00:00Z"
birthDate: "2009-04-16T00:00:00Z"
breedPrimary: "American Bulldog"
breedPrimaryId: 80
breedSecondary: "Boxer"
breedSecondaryId: 104
breedString: "American Bulldog / Boxer / Mixed (short coat)"
coatLength: "Short"
createdDate: "2016-05-22T22:44:01Z"
descriptionHtml: "<p>↵<span style="font-family: arial, helvetica, sans-serif;">Moody is an 11&nbsp;year old, American Bulldog/Boxer mix. He weighs 90 lbs and is literally a gentle giant!&nbsp;</span>↵</p>↵↵<p>↵<span style="font-family: arial, helvetica, sans-serif;">I honestly can&#39;t find anything negative&nbsp;to say about this dog.&nbsp; Ok maybe he&#39;s a bit over-zealous when he drinks water, but really that is all I can think of!!&nbsp; He has all the positive qualities you would want in a dog. Calm, fun, polite, trained, friendly, etc.&nbsp;</span>↵</p>↵↵<p>↵<span style="font-family: arial, helvetica, sans-serif;">Don&#39;t let his exterior fool you - Moody is a big hunk of love!&nbsp; He has never met a stranger - child or adult.&nbsp; He loves to be with you and is content just laying in the same room with you.&nbsp; He walks great on a leash (doesn&#39;t pull) and is very calm and gentle.&nbsp; He rides great in the car</span>↵↵<span style="font-family: arial, helvetica, sans-serif;">&nbsp;and really just wants some love and a soft bed. Moody takes treats nicely and has all the best qualities&nbsp;of an older dog&nbsp; - house trained, crate trained, calm, easy to have around.&nbsp; He sleeps nicely in his crate at night but we are at the point I trust him to be left out.&nbsp;&nbsp;</span>↵</p>↵↵<p><font face="arial, helvetica, sans-serif">He sits nicely during&nbsp;his baths. He also takes correction very well and is a dog that likes to please.&nbsp; He is great with kids and won&#39;t knock them over because he is really very calm. Probably a no cat household would be best as well.&nbsp; He would be happiest as an only dog.&nbsp; He will do ok with a calm, submissive dog that respects his things and space.&nbsp;</font></p>↵↵<p><font face="arial, helvetica, sans-serif">Look past his exterior and you will find a loving, wonderful dog that is looking for his special&nbsp;family or person. Moody is healthy, up to date on all shots, heartworm negative and neutered. He was found in Moody Park - hence his name - but he is anything but moody :)&nbsp;</font></p>↵↵<p>↵<span style="font-family: arial, helvetica, sans-serif;">You can submit an application to adopt Moody at www.hhfrescue.org.&nbsp;</span>↵</p><img src="https://tracker.rescuegroups.org/pet?10032851" width="0" height="0" alt="" />"
descriptionText: "↵Moody is an 11&nbsp;year old, American Bulldog/Boxer mix. He weighs 90 lbs and is literally a gentle giant!&nbsp;↵↵↵↵I honestly can&#39;t find anything negative&nbsp;to say about this dog.&nbsp; Ok maybe he&#39;s a bit over-zealous when he drinks water, but really that is all I can think of!!&nbsp; He has all the positive qualities you would want in a dog. Calm, fun, polite, trained, friendly, etc.&nbsp;↵↵↵↵Don&#39;t let his exterior fool you - Moody is a big hunk of love!&nbsp; He has never met a stranger - child or adult.&nbsp; He loves to be with you and is content just laying in the same room with you.&nbsp; He walks great on a leash (doesn&#39;t pull) and is very calm and gentle.&nbsp; He rides great in the car↵↵&nbsp;and really just wants some love and a soft bed. Moody takes treats nicely and has all the best qualities&nbsp;of an older dog&nbsp; - house trained, crate trained, calm, easy to have around.&nbsp; He sleeps nicely in his crate at night but we are at the point I trust him to be left out.&nbsp;&nbsp;↵↵↵He sits nicely during&nbsp;his baths. He also takes correction very well and is a dog that likes to please.&nbsp; He is great with kids and won&#39;t knock them over because he is really very calm. Probably a no cat household would be best as well.&nbsp; He would be happiest as an only dog.&nbsp; He will do ok with a calm, submissive dog that respects his things and space.&nbsp;↵↵Look past his exterior and you will find a loving, wonderful dog that is looking for his special&nbsp;family or person. Moody is healthy, up to date on all shots, heartworm negative and neutered. He was found in Moody Park - hence his name - but he is anything but moody :)&nbsp;↵↵↵You can submit an application to adopt Moody at www.hhfrescue.org.&nbsp;↵"
distinguishingMarks: "cropped ear"
earType: "Cropped"
energyLevel: "Moderate"
exerciseNeeds: "Moderate"
eyeColor: "Gold"
fenceNeeds: "6 foot"
groomingNeeds: "Low"
indoorOutdoor: "Indoor Only"
isAdoptionPending: false
isBirthDateExact: false
isBreedMixed: true
isCatsOk: false
isCourtesyListing: false
isCurrentVaccinations: true
isDeclawed: false
isDogsOk: true
isFound: false
isHousetrained: true
isKidsOk: true
isNeedingFoster: true
isSpecialNeeds: false
isSponsorable: false
isYardRequired: true
name: "Moody"
newPeopleReaction: "Friendly"
obedienceTraining: "Has Basic Training"
ownerExperience: "Breed"
pictureCount: 17
pictureThumbnailUrl: "https://s3.amazonaws.com/filestore.rescuegroups.org/8115/pictures/animals/10032/10032851/56281570_100x100.jpg"
priority: 10
qualities: (15) ["affectionate", "apartment", "cratetrained", "eagerToPlease", "eventempered", "fetches", "gentle", "doesWellInCar", "goofy", "intelligent", "leashtrained", "noLargeDogs", "obedient", "playful", "playsToys"]
rescueId: "16-0006"
sex: "Male"
sheddingLevel: "Moderate"
sizeCurrent: 90
sizeGroup: "Large"
sizePotential: 90
sizeUOM: "Pounds"
slug: "adopt-moody-american-bulldog-dog"
tailType: "Long"
trackerimageUrl: "https://tracker.rescuegroups.org/pet?10032851"
updatedDate: "2020-07-13T16:55:25Z"
videoCount: 3
videoUrlCount: 3
vocalLevel: "Quiet"
*/