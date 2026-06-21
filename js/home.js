// Save the movie that the visitor chooses on the home page.
var movieCards = document.querySelectorAll('.movie-card');
var selectedMovieText = document.getElementById('selected-movie');
var savedMovie = localStorage.getItem('selectedMovie');

for (var i = 0; i < movieCards.length; i++) {
  movieCards[i].addEventListener('click', chooseMovie);

  // Keep the same movie selected when the visitor returns home.
  if (movieCards[i].dataset.movie === savedMovie) {
    movieCards[i].classList.add('selected');
    selectedMovieText.textContent = savedMovie;
  }
}

function chooseMovie() {
  // Remove the blue border from every movie card.
  for (var i = 0; i < movieCards.length; i++) {
    movieCards[i].classList.remove('selected');
  }

  // Highlight and save the movie that was clicked.
  this.classList.add('selected');
  localStorage.setItem('selectedMovie', this.dataset.movie);
  selectedMovieText.textContent = this.dataset.movie;
}
