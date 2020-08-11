## TO DO
- encrypt json - access token
- speed up external fetch

## QUESTIONS / ISSUES
- semi-colons?
- are my use of globals ok?
- is my use of async/await appropriate?
- refactor with event delegation?
- encrypt json - access token

## STRETCH GOALS
- Image/Video upload
- give breed select on form dropdown style?
- Modal new post form
- add picture caption
- make scrollbar visible - filter by breed and adoption container

## THINGS TO REMEMBER
- js == prototyple inheritance vs ruby == class inheritance 
- functions can be invoked (called), have properties, and prototype methods
- function declaration vs function expression 
    - function declaration (must be named) 
        - does not evaluate return value of itself
        - create a new function object in memory and scoped according to where it's been declared
    - function expression (can be anonymomus) arrow function
        - evaluates to a value
- JS 2 phases
    1. compilation
        - variables and function DECLARATIONS are read and stored into memory (hoisted to top of scope)
    2. execution
        - assignments and executions happen top to bottom
- scope (of something)
    - where it's available (context)
- this
    - contextual reference
    - references the current object in which we are running code

## TO DONE
- Change getElementById to querySelector
- populate breeds table with external API
- find new dog rescue/adoption api
- view by breed filter
- load breeds only once (shared by filter and form select)
    - breed class?
- push new post to breed
- add close button to form
- use petfinder api breeds to seed db
- update num_of_likes in Post.all array when updating DOM
- when filtering by breed, 'liked' heart disappears (if liked, when filtered heart is empty)
- hide filter by breed dropdown when filtered
- show a reset posts button
- reset to all posts
- bring back filter by breed dropdown after reset
- keep active hearts when rendering all posts after filter
- hide api client key and secret
- display thank you alert after rendering new post
- reuse modal code
- use modal for new post errors
- refactor fetchAdoptableDogs to post instance method
- refactor renderAdoptableDog to post instance method
- make globals of commonly selected html
- hide show some love button when filtered
- populateBreedSelect - Breed class method
- fetchPosts() - Post class method
- renderNoAdoptionsNotification - Post instance method

### PETFINDER API       
#### DOG END POINT
GET https://api.petfinder.com/v2/animals
#### BREEDS END POINT
type = Dog
GET https://api.petfinder.com/v2/types/{type}/breeds
#### ORGANIZATION END POINT
GET https://api.petfinder.com/v2/organizations/{id}

#### dog object
{id: 48674035, 
organization_id: "KS05", 
url: "https://www.petfinder.com/dog/stray-48674035/ks/ha…?referrer_id=0989b2a8-1d8a-43d4-bff3-044434a94380", 
type: "Dog", species: "Dog", …}
age: "Adult"
attributes:
declawed: null
house_trained: false
shots_current: false
spayed_neutered: false
special_needs: false
__proto__: Object
breeds:
mixed: false
primary: "English Setter"
secondary: null
unknown: false
__proto__: Object
coat: "Medium"
colors:
    primary: "Tricolor (Brown, Black, & White)"
    secondary: null
    tertiary: null
__proto__: Object
contact:
    address:
        address1: "2050 E. Old Hwy 40"
        address2: "P.O. Box 311"
        city: "Hays"
        country: "US"
        postcode: "67601"
        state: "KS"
__proto__: Object
email: "hshp_hays@hotmail.com"
phone: "(785) 625-5252"
__proto__: Object
description: "This adult, female, English Setter was picked as a stray in Ellis County on 8/3/20. She was found at the..."
distance: null
environment:
cats: true
children: null
dogs: true
__proto__: Object
gender: "Female"
id: 48674035
name: "Stray"
organization_animal_id: null
organization_id: "KS05"
photos: (5) [{…}, {…}, {…}, {…}, {…}]
primary_photo_cropped: {small: "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48674035/4/?bust=1596473242&width=300", medium: "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48674035/4/?bust=1596473242&width=450", large: "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48674035/4/?bust=1596473242&width=600", full: "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48674035/4/?bust=1596473242"}
published_at: "2020-08-03T16:48:50+0000"
size: "Medium"
species: "Dog"
status: "adoptable"
status_changed_at: "2020-08-03T16:48:50+0000"
tags: Array(0)
length: 0
__proto__: Array(0)
type: "Dog"
url: "https://www.petfinder.com/dog/stray-48674035/ks/hays/humane-society-of-the-high-plains-ks05/?referrer_id=0989b2a8-1d8a-43d4-bff3-044434a94380"
videos: []
_links: {self: {…}, type: {…}, organization: {…}}