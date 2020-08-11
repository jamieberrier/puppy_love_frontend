class Post {
  constructor(data) {
    this.id = parseInt(data.id);
    this.breed = data.attributes.breed;
    this.num_of_likes = data.attributes.num_of_likes;
    this.picture = data.attributes.picture;
    // store posts in an array for future use
    Post.all.push(this);
  }

  // Generating HTML for a post
  renderPost() {
    const postsContainer = document.querySelector("#posts-container");
    // create box
    const postBox = document.createElement("div");
    postBox.setAttribute("class", "box");
    postBox.setAttribute("id", `box-${this.id}`);
    postBox.setAttribute("data-breed-id", `${this.breed.id}`)
    // create picture
    const figure = document.createElement("figure");
    figure.setAttribute("class", "image is-256x256")
    const postImage = document.createElement("img");
    postImage.src = this.picture;
    figure.appendChild(postImage);
    postBox.appendChild(figure);
    // create level - Likes & I Want One
    const level = document.createElement("nav");
    level.setAttribute("class", "level is-mobile mt-2");
    level.setAttribute("id", "level")
    // create left level
    const left = document.createElement("div");
    left.setAttribute("class", "level-left is-size-5")
    //  create heart
    const heart = document.createElement("span");
    heart.setAttribute("class", "like-glyph like")
    heart.setAttribute("data-id", this.id)
    heart.innerHTML = '&#x2661';
    heart.addEventListener("click", likePost)
    left.appendChild(heart)
    // create number of likes
    const postLikes = document.createElement('p');
    postLikes.setAttribute("class", "level-item")
    postLikes.innerText = this.num_of_likes;
    left.appendChild(postLikes);
    level.appendChild(left);
    // create right level
    const right = document.createElement("div");
    right.setAttribute("class", "level-right")
    // create 'I Want One' button
    const wantOne = document.createElement("button");
    wantOne.setAttribute("class", "level-item button is-danger is-light is-rounded")
    wantOne.setAttribute("id", `want-one-${this.id}`)
    wantOne.setAttribute("data-post-id", this.id)
    wantOne.setAttribute("data-breed", this.breed.name)
    wantOne.innerText = 'I Want One!'
    wantOne.addEventListener("click", wantDog)
    right.appendChild(wantOne);
    level.appendChild(right);
    // add level to box
    postBox.appendChild(level);
    // add box to top of container
    postsContainer.prepend(postBox);
    // return post
    return postBox
  }

  // Finding post by id
  static findById(id) {
    return this.all.find(post => post.id === id);
  }

  // Updating a post's number of likes
  // // PATCH request
  updateLikes(num_of_likes) {
    let bodyData = {
      id: this.id,
      num_of_likes
    };
  
    let configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyData)
    };
  
    fetch(`${POSTS_END_POINT}/${this.id}`, configObj)
    .then(response => response.json())
    .then(post => {
      // get number of likes
      const likes = post.data.attributes.num_of_likes
      // get post
      const box = document.querySelector(`#box-${post.data.id}`)
      // update DOM with new number of likes
      box.children[1].firstElementChild.children[1].innerText = likes
      // update num_of_likes in Post.all
      const postId = parseInt(post.data.id)
      const p = Post.findById(postId)
      p.num_of_likes = likes
    })
    .catch(error => console.log(error.message))
  }

  // Fetching adoptale dogs of the same breed as the post from petfinder API
  // // GET request
  fetchAdoptableDogs(breed, token) {
    const wantOne = document.querySelector(`#want-one-${this.id}`)
    const page = document.querySelector("html")
    const box = document.querySelector(`#box-${this.id}`)
    // pluralize breed
    const breedPlural = pluralize(breed)

    let configObj = {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      }
    };
    
    fetch (`https://api.petfinder.com/v2/animals?type=dog&breed=${breed}&status=adoptable&limit=100`, configObj)
    .then(response => response.json())
    .then(dogs => {
      // hide 'I Want One!' button
      wantOne.setAttribute("class", "is-hidden")
      // change cursor back
      page.style.cursor = "auto"
      // if adoptable dog(s) found
      if (dogs.animals.length > 0) {
        // create container for adoptable dogs
        const adoptContainer = document.createElement("article")
        adoptContainer.setAttribute("id", `adoption-container-${this.id}`)
        adoptContainer.setAttribute("class", "message is-danger")
        // create header <div>
        const adoptHeaderDiv = document.createElement("div")
        adoptHeaderDiv.setAttribute("class", "message-header heading is-size-5")
        // create header <p>
        const adoptHeader = document.createElement("p")
        adoptHeader.innerText = `Adoptable ${breedPlural}`
        adoptHeaderDiv.appendChild(adoptHeader)
        // create close button
        const closeBtn = document.createElement("button")
        closeBtn.setAttribute("class", "delete")
        closeBtn.setAttribute("aria-label", "delete")
        // add listener to close button
        closeBtn.addEventListener("click", (e) => {
          // remove adoptable dogs container
          adoptContainer.remove()
          // show 'I Want One!' button
          wantOne.setAttribute("class", "level-item button is-danger is-light is-rounded")
        })
        adoptHeaderDiv.appendChild(closeBtn)
        adoptContainer.appendChild(adoptHeaderDiv)
        // add adoption container to post
        box.appendChild(adoptContainer)
        // render each adoptable dog
        dogs.animals.forEach(dog => {
          this.renderAdoptableDog(dog)
        })
      } else { // no adoptable dog(s) found
        renderNoAdoptionsNotification(box, breedPlural)
      }
    })
    .catch(error => {
      console.log(error.message)
      renderNoAdoptionsNotification(box, breedPlural)
    })
  }

  // Generating HTML for each adoptable dog and appending to adoptContainer
  renderAdoptableDog(dog) {
    // get adoption container
    const adoptContainer = document.querySelector(`#adoption-container-${this.id}`)
    // create dog media object
    const dogDiv = document.createElement("article")
    dogDiv.setAttribute("class", "media")
    // create media-left
    const figure = document.createElement("figure");
    figure.setAttribute("class", "media-left mt-4 mb-4")
    // create picture <p>
    const picP = document.createElement("p")
    picP.setAttribute("class", "image is-96x96")
    // create picture <img>
    const pic = document.createElement("img")
    // set picture source
    if (dog.primary_photo_cropped != null) {
      // if has primary photo
      pic.src = dog.primary_photo_cropped.medium
    } else {
      pic.src = "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48637918/1/?bust=1596122132&width=450"
    }
    picP.appendChild(pic)
    figure.appendChild(picP)
    dogDiv.appendChild(figure)
    // create media-content
    const mediaContent = document.createElement("div")
    mediaContent.setAttribute("class", "media-content")
    // create content
    const content = document.createElement("div")
    content.setAttribute("class", "content")
    // create name <p>
    const name = document.createElement("p")
    name.setAttribute("class", "has-text-danger is-size-5 mb-1")
    name.innerText = dog.name
    content.appendChild(name)
    // create details <p> - age, gender, and size
    const details = document.createElement("p")
    details.innerHTML = `${dog.age} ` + '<i class="fas fa-paw"></i>' + ` ${dog.gender} ` + '<i class="fas fa-paw"></i>' + ` ${dog.size}`
    content.appendChild(details)
    // create location <p> - city and state
    const location = document.createElement("p")
    location.innerHTML = '<i class="fas fa-map-marked-alt"></i>' + ` ${dog.contact.address.city}` + ', ' + `${dog.contact.address.state}`
    content.appendChild(location)
    // create url <p>
    const urlP = document.createElement("p")
    urlP.setAttribute("class", "has-text-link")
    // create url <a>
    const url = document.createElement("a")
    url.setAttribute("href", `${dog.url}`)
    // open in new tab
    url.setAttribute("target", "_blank")
    url.innerText = `Tell Me More About ${dog.name}!`
    urlP.appendChild(url)
    content.appendChild(urlP)
    mediaContent.appendChild(content)
    dogDiv.appendChild(mediaContent)
    adoptContainer.appendChild(dogDiv)
  }
}

Post.all = [];