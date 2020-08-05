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
    const postsContainer = document.querySelector("#posts-container")
    const posts = Object.entries(postsContainer.children)
    // clear posts of other breeds from post-container
    for (const index in posts) {
      if (posts.hasOwnProperty(index)) {
        const element = posts[index][1]
        const postBreedId = parseInt(element.dataset.breedId)
        
        if (this.id !== postBreedId) {
          postsContainer.removeChild(element)
        }
      }
    }
  }
}

Breed.all = [];