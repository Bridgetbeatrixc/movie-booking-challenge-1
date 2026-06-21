// Movie information from the home page.
var defaultMovie = 'The Conjuring: Last Rites';
var selectedMovie = localStorage.getItem('selectedMovie') || defaultMovie;

// Seat settings.
var ticketPrice = 35000;
var rows = ['A', 'B', 'C', 'D', 'E', 'F'];
var occupiedSeats = ['A4', 'B2', 'C7', 'D3', 'E8'];
var selectedSeats = [];

// Page elements.
var summaryMovie = document.getElementById('summary-movie');
var heroMovie = document.getElementById('hero-movie-title');
var seatLayout = document.getElementById('seat-layout');
var selectedSeatsText = document.getElementById('selected-seats');
var seatCount = document.getElementById('seat-count');
var totalPrice = document.getElementById('total-price');
var resetButton = document.getElementById('reset-button');

showMovieName();
createSeatLayout();
resetButton.addEventListener('click', resetBooking);

function showMovieName() {
  summaryMovie.textContent = selectedMovie;
  heroMovie.textContent = selectedMovie;
}

function createSeatLayout() {
  for (var row = 0; row < rows.length; row++) {
    var rowBox = document.createElement('div');
    rowBox.className = 'flex items-center gap-2';

    var rowName = document.createElement('span');
    rowName.className = 'w-4 text-center text-sm text-slate-400';
    rowName.textContent = rows[row];
    rowBox.appendChild(rowName);

    for (var number = 1; number <= 8; number++) {
      var seat = document.createElement('button');
      var seatName = rows[row] + number;

      seat.textContent = number;
      seat.dataset.seat = seatName;
      seat.className = 'seat h-8 flex-1 rounded border border-slate-600 bg-slate-700 text-xs transition hover:border-blue-300 hover:bg-slate-600';

      if (occupiedSeats.indexOf(seatName) !== -1) {
        seat.classList.add('occupied');
        seat.disabled = true;
      }

      seat.addEventListener('click', toggleSeat);
      rowBox.appendChild(seat);
    }

    seatLayout.appendChild(rowBox);
  }
}

function toggleSeat() {
  var seatName = this.dataset.seat;
  var seatPosition = selectedSeats.indexOf(seatName);

  if (seatPosition === -1) {
    selectedSeats.push(seatName);
    this.classList.add('selected');
  } else {
    selectedSeats.splice(seatPosition, 1);
    this.classList.remove('selected');
  }

  updateSummary();
}

function updateSummary() {
  var total = selectedSeats.length * ticketPrice;

  selectedSeatsText.textContent = selectedSeats.length
    ? selectedSeats.join(', ')
    : 'No seats selected';
  seatCount.textContent = selectedSeats.length;
  totalPrice.textContent = 'Rp' + total.toLocaleString('id-ID');
}

function resetBooking() {
  selectedSeats = [];

  var activeSeats = document.querySelectorAll('.seat.selected');
  for (var i = 0; i < activeSeats.length; i++) {
    activeSeats[i].classList.remove('selected');
  }

  localStorage.removeItem('selectedMovie');
  selectedMovie = 'No movie selected';
  showMovieName();
  updateSummary();
}
