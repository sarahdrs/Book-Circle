// import { userInfo } from "os";

document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


//function to toggle "Results:" in /find-book
$("#searchBtn").click(function(){
  $("#results").css('display','none');
  console.log("button pressed")
});




//function that favorites books will be displayed in dashboard

// displayFavorites(){
//   {{#each userInfo.favorites}}
//     https://www.googleapis.com/books/v1/volumes/{{user.favorites}}"&callback=handleResponse
//   }
//   function handleResponse(response) {
//     for (var i = 0; i < response.items.length; i++) {
//       var item = response.items[i];
//       // in production code, item.text should have the HTML entities escaped.
//       document.getElementById("book-image").innerHTML = item.volumeInfo.thumbnail;
//     }
//   }
