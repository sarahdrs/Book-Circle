// <link
// src = "https://code.jquery.com/jquery-3.3.1.js"
// integrity = "sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
// crossorigin = "anonymous" >

document.addEventListener('DOMContentLoaded', () => {
  $("#searchBtn").click(function () {
    $("#results").css('display', 'none');
    console.log("button pressed")
  });

  console.log('IronGenerator JS imported successfully!');

}, false);


//function to toggle "Results:" in /find-book
