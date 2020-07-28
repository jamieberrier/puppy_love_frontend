## TO DO
- display thank you alert after rendering new post
- view by breed filter
- Modal new post form

## TO DONE
- Change getElementById to querySelector

## QUESTIONS / ISSUES
- Want to populate breeds table with external API
- Is it a project requirement to display the has_many in the DOM?
- .catch not displaying validation errors
  ``` javascript
  // function addNewPost(event) 
  // ...
  return fetch(endPoint, configObj)
  .then(response => response.json())
  .then(post => {
    if (post.errors) {
      alert(post.errors)
    } else {
      const newPost = new Post(post.data);
      newPost.renderPost();
      // reset form
      document.querySelector("#new-post-form").reset();
      alert("Thanks For The Love!")
    }
  })
  .catch(error => {
    alert(error.message)
  })
  ```
- how to upload image/video

### RESCUEGROUPS API
#### DOG.ATTRIBUTES
``` json
activityLevel: "Slightly Active"
adoptionFeeString: "225.00"
adultSexesOk: "All"
ageGroup: "Senior"
ageString: "11 Years 2 Months"
availableDate: "2016-06-01T00:00:00Z"
birthDate: "2009-04-16T00:00:00Z"
breedPrimary: "American Bulldog"
breedPrimaryId: 80
breedSecondary: "Boxer"
breedSecondaryId: 104
breedString: "American Bulldog / Boxer / Mixed (short coat)"
coatLength: "Short"
createdDate: "2016-05-22T22:44:01Z"
descriptionHtml: "<p>↵<span style="font-family: arial, helvetica, sans-serif;">Moody is an 11&nbsp;year old, American Bulldog/Boxer mix. He weighs 90 lbs and is literally a gentle giant!&nbsp;</span>↵</p>↵↵<p>↵<span style="font-family: arial, helvetica, sans-serif;">I honestly can&#39;t find anything negative&nbsp;to say about this dog.&nbsp; Ok maybe he&#39;s a bit over-zealous when he drinks water, but really that is all I can think of!!&nbsp; He has all the positive qualities you would want in a dog. Calm, fun, polite, trained, friendly, etc.&nbsp;</span>↵</p>↵↵<p>↵<span style="font-family: arial, helvetica, sans-serif;">Don&#39;t let his exterior fool you - Moody is a big hunk of love!&nbsp; He has never met a stranger - child or adult.&nbsp; He loves to be with you and is content just laying in the same room with you.&nbsp; He walks great on a leash (doesn&#39;t pull) and is very calm and gentle.&nbsp; He rides great in the car</span>↵↵<span style="font-family: arial, helvetica, sans-serif;">&nbsp;and really just wants some love and a soft bed. Moody takes treats nicely and has all the best qualities&nbsp;of an older dog&nbsp; - house trained, crate trained, calm, easy to have around.&nbsp; He sleeps nicely in his crate at night but we are at the point I trust him to be left out.&nbsp;&nbsp;</span>↵</p>↵↵<p><font face="arial, helvetica, sans-serif">He sits nicely during&nbsp;his baths. He also takes correction very well and is a dog that likes to please.&nbsp; He is great with kids and won&#39;t knock them over because he is really very calm. Probably a no cat household would be best as well.&nbsp; He would be happiest as an only dog.&nbsp; He will do ok with a calm, submissive dog that respects his things and space.&nbsp;</font></p>↵↵<p><font face="arial, helvetica, sans-serif">Look past his exterior and you will find a loving, wonderful dog that is looking for his special&nbsp;family or person. Moody is healthy, up to date on all shots, heartworm negative and neutered. He was found in Moody Park - hence his name - but he is anything but moody :)&nbsp;</font></p>↵↵<p>↵<span style="font-family: arial, helvetica, sans-serif;">You can submit an application to adopt Moody at www.hhfrescue.org.&nbsp;</span>↵</p><img src="https://tracker.rescuegroups.org/pet?10032851" width="0" height="0" alt="" />"
descriptionText: "↵Moody is an 11&nbsp;year old, American Bulldog/Boxer mix. He weighs 90 lbs and is literally a gentle giant!&nbsp;↵↵↵↵I honestly can&#39;t find anything negative&nbsp;to say about this dog.&nbsp; Ok maybe he&#39;s a bit over-zealous when he drinks water, but really that is all I can think of!!&nbsp; He has all the positive qualities you would want in a dog. Calm, fun, polite, trained, friendly, etc.&nbsp;↵↵↵↵Don&#39;t let his exterior fool you - Moody is a big hunk of love!&nbsp; He has never met a stranger - child or adult.&nbsp; He loves to be with you and is content just laying in the same room with you.&nbsp; He walks great on a leash (doesn&#39;t pull) and is very calm and gentle.&nbsp; He rides great in the car↵↵&nbsp;and really just wants some love and a soft bed. Moody takes treats nicely and has all the best qualities&nbsp;of an older dog&nbsp; - house trained, crate trained, calm, easy to have around.&nbsp; He sleeps nicely in his crate at night but we are at the point I trust him to be left out.&nbsp;&nbsp;↵↵↵He sits nicely during&nbsp;his baths. He also takes correction very well and is a dog that likes to please.&nbsp; He is great with kids and won&#39;t knock them over because he is really very calm. Probably a no cat household would be best as well.&nbsp; He would be happiest as an only dog.&nbsp; He will do ok with a calm, submissive dog that respects his things and space.&nbsp;↵↵Look past his exterior and you will find a loving, wonderful dog that is looking for his special&nbsp;family or person. Moody is healthy, up to date on all shots, heartworm negative and neutered. He was found in Moody Park - hence his name - but he is anything but moody :)&nbsp;↵↵↵You can submit an application to adopt Moody at www.hhfrescue.org.&nbsp;↵"
distinguishingMarks: "cropped ear"
earType: "Cropped"
energyLevel: "Moderate"
exerciseNeeds: "Moderate"
eyeColor: "Gold"
fenceNeeds: "6 foot"
groomingNeeds: "Low"
indoorOutdoor: "Indoor Only"
isAdoptionPending: false
isBirthDateExact: false
isBreedMixed: true
isCatsOk: false
isCourtesyListing: false
isCurrentVaccinations: true
isDeclawed: false
isDogsOk: true
isFound: false
isHousetrained: true
isKidsOk: true
isNeedingFoster: true
isSpecialNeeds: false
isSponsorable: false
isYardRequired: true
name: "Moody"
newPeopleReaction: "Friendly"
obedienceTraining: "Has Basic Training"
ownerExperience: "Breed"
pictureCount: 17
pictureThumbnailUrl: "https://s3.amazonaws.com/filestore.rescuegroups.org/8115/pictures/animals/10032/10032851/56281570_100x100.jpg"
priority: 10
qualities: (15) ["affectionate", "apartment", "cratetrained", "eagerToPlease", "eventempered", "fetches", "gentle", "doesWellInCar", "goofy", "intelligent", "leashtrained", "noLargeDogs", "obedient", "playful", "playsToys"]
rescueId: "16-0006"
sex: "Male"
sheddingLevel: "Moderate"
sizeCurrent: 90
sizeGroup: "Large"
sizePotential: 90
sizeUOM: "Pounds"
slug: "adopt-moody-american-bulldog-dog"
tailType: "Long"
trackerimageUrl: "https://tracker.rescuegroups.org/pet?10032851"
updatedDate: "2020-07-13T16:55:25Z"
videoCount: 3
videoUrlCount: 3
vocalLevel: "Quiet"
```

#### org.data[0].attributes
``` json
about: "Honoring Hope and Faith Rescue, Inc. (HHFR) is a 501(c)3 non-profit, all-breed dog rescue committed to saving the lives of the abused, abandoned, neglected and forgotten. We are a volunteer-based foster program that is dedicated to finding happy and forever homes for our rescued dogs. We rely 100% on donations to provide monetary support for boarding expenses, vet and medical care, and operational support. Help us make a difference in a deserving dogâs life."
adoptionProcess: "Adoption Application, Meet / Greet, Adoption or Foster-to-Adopt Contract.  Home Ownership or Rental Pet Agreement with appropriate deposit and size/breed restrictions."
city: "Houston"
citystate: "Houston, TX"
coordinates: "29.9145, -95.6531"
country: "United States"
email: "HHFRescue@gmail.com"
isCommonapplicationAccepted: false
lat: 29.9145
lon: -95.6531
meetPets: ["Adoption events will be posted on our social media accounts."]
name: "Honoring Hope and Faith Rescue, Inc."
phone: "(866) 774-4673"
postalcode: "77095"
serveAreas: "Houston, Conroe, Galveston, League City, Pearland, Sugar Land, Cypress, Katy, Harris County, Fort Bend County, Galveston County, Montgomery County, Brazoria County, Minnesota"
services: "Adoption, spay/neuter"
state: "TX"
type: "Rescue"
url: "http://www.HHFRescue.org"
```