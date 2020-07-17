console.log("in index.js");

const endPoint = "http://localhost:3000/api/v1/posts"

document.addEventListener('DOMContentLoaded', () => {
    console.log('LOADED');
    fetch(endPoint)
    .then(response => response.json())
    .then(posts => {
      console.log(posts);
    })
  });