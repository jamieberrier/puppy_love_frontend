class Post {
  constructor(data) {
    this.id = parseInt(data.id);
    this.breed = data.attributes.breed;
    this.num_of_likes = data.attributes.num_of_likes;
    this.picture = data.attributes.picture;
    // store posts in an array for future use
    Post.all.push(this);
  }

  renderPost() {
    const postContainer = document.querySelector("#post-container");
    // create box
    const postBox = document.createElement("div");
    postBox.setAttribute("class", "box");
    postBox.setAttribute("id", `box-${this.id}`);
    postBox.setAttribute("data-breed-id", `${this.breed.id}`)
    // picture
    const figure = document.createElement("figure");
    figure.setAttribute("class", "image is-256x256")
    const postImage = document.createElement("img");
    postImage.src = this.picture;
    figure.appendChild(postImage);
    postBox.appendChild(figure);
    // create level for Likes & I Want One
    const level = document.createElement("nav");
    level.setAttribute("class", "level is-mobile");
    level.setAttribute("id", "level")
    // left
    const left = document.createElement("div");
    left.setAttribute("class", "level-left")
    // heart
    //<i class="far fa-heart"></i>
    //const heart = document.createElement("i");
    const heart = document.createElement("span");
    //heart.setAttribute("class", "level-item far fa-heart")
    heart.setAttribute("class", "like-glyph like")
    heart.setAttribute("data-id", this.id)
    heart.innerHTML = '&#x2661';
    heart.addEventListener("click", likePost)
    left.appendChild(heart)
    // likes
    const postLikes = document.createElement('p');
    postLikes.setAttribute("class", "level-item")
    postLikes.innerText = this.num_of_likes;
    left.appendChild(postLikes);
    level.appendChild(left);
    // right
    const right = document.createElement("div");
    right.setAttribute("class", "level-right")
    // I Want One
    const wantOne = document.createElement('p');
    wantOne.setAttribute("class", "has-text-danger level-item like")
    wantOne.setAttribute("id", `want-one-${this.id}`)
    wantOne.setAttribute("data-post-id", this.id)
    wantOne.setAttribute("data-breed", this.breed.name)
    wantOne.innerText = "I Want One!";
    wantOne.style = "text-decoration: underline"
    wantOne.addEventListener("click", wantDog)
    right.appendChild(wantOne);
    level.appendChild(right);
    // add level to box
    postBox.appendChild(level);
    // add box to top of container
    postContainer.prepend(postBox);
    // return post
    return postBox
  }

  static findById(id) {
    return this.all.find(post => post.id === id);
  }

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
  
    return fetch(`${postsEndPoint}/${this.id}`, configObj)
    .then(response => response.json())
    .then(post => {
      const likes = post.data.attributes.num_of_likes
      const box = document.querySelector(`#box-${post.data.id}`)
      box.children[1].firstElementChild.children[1].innerText = likes
      // update num_of_likes in Post.all
      const postId = parseInt(post.data.id)
      const p = Post.findById(postId)
      p.num_of_likes = likes
    })
    .catch(error => console.log(error.message))
  }
}

Post.all = [];