class Breed {
  constructor(data) {
    this.id = parseInt(data.id);
    this.name = data.attributes.name;
    this.posts = data.attributes.posts;
    // store breeds in an array for future use
    Breed.all.push(this);
  }

  // Finding breed by id
  static findById(id) {
    return this.all.find(breed => breed.id === id);
  }

  // Populating dropdown menu with dog breeds
  // // GET request - all dog breeds
  static populateBreedFilter() {
    // get 'filter by breed' dropdown menu content
    const breedContent = document.querySelector("#breed-content");
    // GET /api/v1/breeds
    fetch(BREEDS_END_POINT)
    .then(response => response.json())
    .then(breeds => {
      for (const breed of breeds.data) {
        // create new breed object instance
        new Breed(breed);
        // create breed <a>
        const breedLink = document.createElement("a");
        // set link class
        breedLink.setAttribute("class", "dropdown-item");
        // set link id
        breedLink.setAttribute("id", `${breed.id}`);
        // display breed name
        breedLink.innerHTML = `${breed.attributes.name}`;
        // add event listener to link
        breedLink.addEventListener("click", handleFilterClick);
        // apend link to dropdown menu content
        breedContent.appendChild(breedLink);
      }
    })
    .catch(error => alert(error.message));
  }

  // Populating form select with dog breeds
  static populateBreedSelect() {
    // get <select> dog breed
    const breedSelect = document.querySelector("#breeds");
    // for each breed
    for (const breed of this.all) {
      // create option
      const option = document.createElement("option");
      // set option id
      option.setAttribute("id", `breed-${breed.id}`);
      // set option value
      option.setAttribute("value", `${breed.id}`);
      // display breed name
      option.innerHTML = `${breed.name}`;
      // add option to select
      breedSelect.appendChild(option);
    }
  }

  // Clearing the posts of other breeds from the posts-container
  renderBreedPosts() {
    // get posts in an array
    const posts = Object.entries(postsContainer.children);
    // iterate over all posts
    for (const index in posts) {
      // if posts has index as its own property
      if (posts.hasOwnProperty(index)) {
        // get post <div>
        const element = posts[index][1];
        // get post's breed id
        const postBreedId = parseInt(element.dataset.breedId);
        // if the post's breed id doesn't match the selected breed's id
        if (postBreedId !== this.id) {
          // remove post <div>
          postsContainer.removeChild(element);
        }
      }
    }
  }
}

Breed.all = [];