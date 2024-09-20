import { Component } from '@angular/core';

@Component({
  selector: 'app-seat_booking',
  templateUrl: './seat_booking.component.html',
  styleUrls: ['./seat_booking.component.css']
})
export class SeatBookingComponent {
  seats: number[] = new Array(80).fill(0); // 0 means available, 1 means booked
  bookedSeatsList: number[] = []; // Array to hold the booked seat numbers
  numSeats: number = 1; // Number of seats to book
  bookedSeatsInput: string = ''; // Input for pre-booked seats

  constructor() {
    // If there are any initially booked seats (this can come from user input or database)
    this.initializePreBookedSeats();
  }

  // Method to initialize pre-booked seats from user input or other source
  initializePreBookedSeats(): void {
    if (this.bookedSeatsInput) {
      const bookedSeats = this.bookedSeatsInput.split(',').map(seat => parseInt(seat.trim(), 10));
      bookedSeats.forEach(seatNumber => {
        if (seatNumber >= 1 && seatNumber <= 80) {
          this.seats[seatNumber - 1] = 1; // Mark the seat as booked (1)
        }
      });
    }
  }

  // Method to book multiple seats
 // Method to book multiple seats with priority to book in one row
bookSeats(numSeats: number): void {
  if (numSeats < 1 || numSeats > 7) {
    alert('You can book between 1 and 7 seats.');
    return;
  }

  // Try to find available seats in the same row
  const rowSize = 7; // 7 seats per row except the last row which has 3 seats
  let seatsBooked: number[] = [];

  for (let row = 0; row < Math.floor(this.seats.length / rowSize); row++) {
    const rowStart = row * rowSize;
    const rowSeats = this.seats.slice(rowStart, rowStart + rowSize);
    const availableSeatsInRow = rowSeats.filter(seat => seat === 0).length;

    // If there are enough available seats in this row, book them
    if (availableSeatsInRow >= numSeats) {
      let bookedInRow = 0;
      for (let i = 0; i < rowSeats.length; i++) {
        if (rowSeats[i] === 0 && bookedInRow < numSeats) {
          this.seats[rowStart + i] = 1; // Mark seat as booked
          seatsBooked.push(rowStart + i + 1); // Seat number starts from 1
          bookedInRow++;
        }
      }
      this.bookedSeatsList = [...this.bookedSeatsList, ...seatsBooked];
      alert(`Seats booked: ${seatsBooked.join(', ')}`);
      return;
    }
  }

  // If no row has enough space, find nearby available seats
  if (seatsBooked.length === 0) {
    seatsBooked = [];
    let bookedCount = 0;

    for (let i = 0; i < this.seats.length; i++) {
      if (this.seats[i] === 0 && bookedCount < numSeats) {
        this.seats[i] = 1; // Mark seat as booked
        seatsBooked.push(i + 1); // Seat number starts from 1
        bookedCount++;
      }
    }

    if (seatsBooked.length > 0) {
      this.bookedSeatsList = [...this.bookedSeatsList, ...seatsBooked];
      alert(`Seats booked: ${seatsBooked.join(', ')}`);
    } else {
      alert('Not enough seats available.');
    }
  }
}

  // Method to reset all seats
  resetSeats(): void {
    this.seats = new Array(80).fill(0); // Reset all seats to available
    this.bookedSeatsList = []; // Clear the list of booked seats
    this.bookedSeatsInput = ''; // Reset the input for booked seats
    alert('All seats have been reset.');
  }
}
