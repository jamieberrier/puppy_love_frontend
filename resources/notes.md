## TO DO
- when filtering by breed, 'liked' heart disappears (if liked, when filtered heart is empty)
- reset to all posts
- make scrollbar visible - filter by breed and adoption container
- display thank you alert after rendering new post

## STRETCH
- Modal new post form
- Image/Video upload
- give breed select on form dropdown style?

## TO DONE
- Change getElementById to querySelector
- populate breeds table with external API
- find new dog rescue/adoption api
- view by breed filter
- load breeds only once (shareb by filter and form select)
    - breed class?
- push new post to breed
- add close button to form
- use petfinder api breeds to seed db
- update num_of_likes in Post.all array when updating DOM

## QUESTIONS / ISSUES
- How to hide api client key and secret
- how to upload image/video

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