class Post {
  constructor(data) {
    this.id = data.id;
    this.breed_id = data.attributes.breed.id;
    this.num_of_likes = data.attributes.num_of_likes;
    this.picture = data.attributes.picture;
  }

  renderPost() {
    const postContainer = document.getElementById("post-container");
    // create box
    const postBox = document.createElement("div");
    postBox.setAttribute("class", "box");
    postBox.setAttribute("data-id", this.id);
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
    // left
    const left = document.createElement("div");
    left.setAttribute("class", "level-left")
    // heart
    //<i class="far fa-heart"></i>
    const heart = document.createElement("i");
    // const heart = document.createElement("span");
    heart.setAttribute("class", "level-item far fa-heart")
    // heart.setAttribute("class", "level-item far like-glyph")
    heart.setAttribute("data-id", this.id)
    //heart.innerHTML = '&#x2661';
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
    wantOne.setAttribute("class", "level-item")
    wantOne.setAttribute("data-id", this.id)
    wantOne.innerText = "I Want One!";
    right.appendChild(wantOne);
    level.appendChild(right);
    // add level
    postBox.appendChild(level);
    // add box
    postContainer.appendChild(postBox);
  }
}