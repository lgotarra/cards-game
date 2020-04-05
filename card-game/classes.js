// Classes for the card game model.

class Card {
  constructor(value, family, display) {
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
  constructor(cards, kind, lastCard) {
    this.cards = cards;
    switch (kind) {
      case "player":
        this.visible = [];
        break;
      case "table":
        this.visible = Array.from(Array(cards.length).keys());
        break;
      case "pile":
        if (lastCard) {
          this.visible = [cards.length - 1];
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

  addCard(card) {
    if (typeof card != Card) {
      throw new TypeError(`You must insert a Card object`);
    }
    this.cards.push(card);
    switch (this.kind) {
      case "table":
        this.visible.push(this.cards.length - 1);
        break;
      case "pile":
        if (this.visible.length == 1) {
          this.visible[0] = this.cards.length - 1;
        }
        break;
    }
  }
}
