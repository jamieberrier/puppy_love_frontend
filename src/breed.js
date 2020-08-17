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
    // get all dog breeds
    fetch(BREEDS_END_POINT)
    .then(response => response.json())
    .then(breeds => {
      for (const breed of breeds.data) {
        // create new breed object instance
        new Breed(breed);
        // create breed <a>
        const option = document.createElement("a");
        option.setAttribute("class", "dropdown-item");
        option.setAttribute("id", `${breed.id}`);
        option.innerHTML = `${breed.attributes.name}`;
        // add event listener to breed name
        option.addEventListener("click", handleFilterClick);
        breedContent.appendChild(option);
      }
    })
    .catch(error => console.log(error.message));
  }

  // Populating form select with dog breeds
  static populateBreedSelect() {
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
      // add to select
      breedSelect.appendChild(option);
    }
  }

  // Rendering a breed's posts
  renderBreedPosts() {
    // get posts in an array
    const posts = Object.entries(postsContainer.children);
    // hide add new post button
    addBtn.parentElement.setAttribute("class", "is-hidden");
    // clear posts of other breeds from posts-container
    for (const index in posts) {
      if (posts.hasOwnProperty(index)) {
        // get post
        const element = posts[index][1];
        // get post's breed id
        const postBreedId = parseInt(element.dataset.breedId);
        // remove post if breed id doesn't match the post's breed id
        if (this.id !== postBreedId) {
          postsContainer.removeChild(element);
        }
      }
    }
  }
}

Breed.all = [];