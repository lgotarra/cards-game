// Classes for the card game model.

class Card {
  constructor(value, family, display) {
    // Card with image
    if (isNaN(value)) {
      throw new TypeError(`"value" must be a number`);
    }
    this.value = value;
    this.family = family;
    this.display = display;
  }
  set display(display) {
    // Set a card image
    this.display = display;
  }
  get value() {
    return this.value;
  }
  get family() {
    return this.family;
  }
}

class Hand {
  constructor(list, kind, lastCard) {
    // Default constructor
    this.list = list;
    switch (kind) {
      case `player`:
        this.visible = [];
        break;
      case `table`:
        this.visible = Array.from(Array(list.length).keys());
        break;
      case `pile`:
        if (lastCard) {
          this.visible = [list.length - 1];
        } else if (!lastCard) {
          this.visible = [];
        } else {
          throw new TypeError(`"lastCard" must be boolean`);
        }
        break;
      default:
        throw new TypeError(`"kind" must be "player", "table" or "pile"`);
    }
    this.kind = kind;
  }
}
