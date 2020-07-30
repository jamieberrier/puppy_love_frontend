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
    // clear post-container
    while (postContainer.firstChild) {
      postContainer.removeChild(postContainer.firstChild)
    }
    // loop through posts and call renderPost
    this.posts.forEach(breedPost => {
      // find post
      const post = Post.findById(breedPost.id)
      // render post
      post.renderPost()
    })
  }
}

Breed.all = [];