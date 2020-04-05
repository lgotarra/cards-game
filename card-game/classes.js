// Classes for the card game model.

class Card {
  constructor(value, family) {
    // Default constructor
    this.value = value;
    this.family = family;
  }
  constructor(value, family, display) {
    // Card with image
    this.value = value;
    this.family = family;
    this.display = display;
  }
  set Display(display) {
    // Set a card image
    this.display = display;
  }
}


