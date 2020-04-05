// Classes for the card game model.

class Card {
  constructor(value, family, display) {
    if (!Number.isInteger(value)) {
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
    if (card.constructor.name != "Card") {
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

  addCards(listCards) {
    for (let i = 0; i < listCards.length; i++) {
      if (listCards[i].constructor.name != "Card") {
        throw new TypeError(
          `You must insert a Card object. Bad parameter at index = ${i}`
        );
      }
      this.cards.push(listCards[i]);
    }
    switch (this.kind) {
      case "table":
        this.visible = Array.from(Array(cards.length).keys());
        break;
      case "pile":
        if (this.visible.length == 1) {
          this.visible[0] = this.cards.length - 1;
        }
        break;
    }
  }

  removeCard(card) {
    // card could be a Card object or the index of a Card element from this.cards
    if (Number.isInteger(card)) {
      this.cards.splice(card, 1);
      let visible_index = this.visible.indexOf(card);
      if (visible_index != -1) {
        this.visible.splice(visible_index, 1);
      }
    } else if (card.constructor.name == "Card") {
      let cards_index = this.cards.indexOf(card);
      if (cards_index == -1) {
        throw new ReferenceError(`The card ${card} is not in this hand`);
      } else {
        this.cards.splice(cards_index, 1);
      }
      let visible_index = this.visible.indexOf(cards_index);
      if (visible_index != -1) {
        this.visible.splice(visible_index, 1);
      }
    } else {
      throw new TypeError(`"card" must be a number or a Card object`);
    }
  }
}
