class Breed {
  constructor(data) {
    this.id = parseInt(data.id);
    this.name = data.attributes.name;
    this.posts = data.attributes.posts;
    // store breeds in an array for future use
    Breed.all.push(this);
  }

  static findById(id) {
    return this.all.find(breed => breed.id === id);
  }

  renderBreedPosts() {
    const postContainer = document.querySelector("#post-container")
    const posts = Object.entries(postContainer.children)
    // clear posts of other breeds from post-container
    for (const index in posts) {
      if (posts.hasOwnProperty(index)) {
        const element = posts[index][1]
        const postBreedId = parseInt(element.dataset.breedId)
        
        if (this.id !== postBreedId) {
          postContainer.removeChild(element)
        }
      }
    }
  }
}

Breed.all = [];