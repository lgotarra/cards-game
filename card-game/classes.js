/*================================================================================================
==================================================================================================
==================================================================================================
This file contains all the classes and methods required for the game model. There are also defined
the most common errors when calling some methods.
==================================================================================================
==================================================================================================
=================================================================================================*/

/*================================================================================================
  -------------------------------------------COMMON ERRORS----------------------------------------
  ================================================================================================*/

let NotAvailableCard = new ReferenceError(
  `The card you requested is not in this hand`
);
let NotANumberNorCard = new TypeError(
  `"card" must be a number or a Card object`
);
let NotANumber = new TypeError(`"card" must be a number`);

let NotACard = new TypeError(`"card" must be a Card object`);

let OutOfArray = new ReferenceError(
  `The object that you are looking for is out of this hand. Please try a lower input`
);

class KindError extends Error {
  constructor(message) {
    super(message);
    this.name = "KindError";
  }
}

let NotAvailableMethod = new KindError(
  `This method is not available for this kind of hand`
);

class Card {
  /**
   * Default Card constructor
   * @param {Number} value Card value
   * @param {String} suit Card suit
   * @param {String} display Route to the card picture. (IMG i.ex. .png)
   */
  constructor(value, suit, display) {
    if (!Number.isInteger(value)) {
      throw new TypeError(`"value" must be a number`);
    }
    this.value = value;
    this.suit = suit;
    this.display = display;
  }

  /*================================================================================================
  ----------------------------------------GETTERS & SETTERS-----------------------------------------
  =================================================================================================*/

  /**
   * Set a IMG or SVG reference for a card
   * @param {String} display
   */
  set display(display) {
    this.display = display;
  }
  /**
   * Gets the current card display
   */
  get display() {
    return this.display;
  }
  /**
   * Gets the current card value
   */
  get value() {
    return this.value;
  }
  /**
   * Gets the current card suit
   */
  get suit() {
    return this.suit;
  }
}

class Hand {
  /**
   * Default Hand constructor. Attributes: cards (Array<Card>),
   * kind (Type of hand), visible (Public/Visible cards).
   * @param {String} name Owner name
   * @param {Array<Card>} cards Array of cards that belongs to a hand
   * @param {String} kind Type of hand: player | table | pile.
   * Player: default visible cards none.
   * Table: default visible cards all.
   * Pile: only the last card can be visible. Useful for the draw or de discard piles.
   * @param {Boolean} lastCard True: last card visible. False: last card not visible. Only
   * available for "pile" kind
   */
  constructor(name, cards, kind, lastCard) {
    this.name = name;
    this.cards = cards;
    this.kind = kind;
    switch (kind) {
      case "player":
        this.visible = [];
        break;
      case "table":
        this.visible = cards;
        break;
      case "pile":
        if (lastCard) {
          this.visible[0] = cards[cards.length - 1];
        } else {
          this.visible = [];
        }
        break;
      default:
        throw new TypeError(`"kind" must be "player", "table" or "pile"`);
    }
  }

  /*================================================================================================
  ----------------------------------------GETTERS & SETTERS-----------------------------------------
  =================================================================================================*/
  /**
   * Gets the owner name
   */
  get name() {
    return this.name;
  }

  /**
   * Gets the cards array
   */
  get cards() {
    return this.cards;
  }

  /**
   * Gets the kind of a hand
   */
  get kind() {
    return this.kind;
  }

  /**
   * Gets a card from the hand.
   * @param {Number | Card} card Index or Card that you want to get.
   */
  getCard(card) {
    switch (card.constructor.name) {
      case "Number":
        if (card < this.cards.length) {
          return this.cards[card];
        } else {
          throw OutOfArray;
        }
      case "Card":
        let cards_index = this.cards.indexOf(card);
        if (cards_index == -1) {
          throw NotAvailableCard;
        } else {
          return this.cards[cards_index];
        }
      default:
        throw NotANumberNorCard;
    }
  }

  /**
   * Gets the visible cards. Returns an Array<Card>
   */
  get visible() {
    return this.visible;
  }

  /**
   * Set one card visible. If the card is already visible, sends a message.
   * @param {Card} card Card that you want to set visible
   */
  set visible(card) {
    if (this.kind != "pile") {
      if (card.constructor.name != "Card") {
        throw NotACard;
      }
      let card_index = this.cards.indexOf(card);
      if (card_index == -1) {
        throw NotAvailableCard;
      } else {
        let visible_index = this.visible.indexOf(card);
        if (visible_index == -1) {
          this.visible.push(card);
        } else {
          console.log("Card already visible");
        }
      }
    } else {
      throw NotAvailableMethod;
    }
  }

  /**
   * Set some cards visible. This will drop any previous visible card.
   * Only available for "player" and "table" hands.
   * @param {Array<Card>} cards Array of cards that you want to set visible
   */
  set visible(cards) {
    if (this.kind != "pile") {
      for (let card of cards) {
        if (card.constructor.name != "Card") {
          throw new Error(
            `Error at element ${cards.indexOf(card)} \n ${NotACard.error} ${
              NotACard.message
            }`
          );
        } else if (this.cards.indexOf(card) == -1) {
          throw new Error(
            `Error at element ${cards.indexOf(card)} \n ${OutOfArray.error} ${
              OutOfArray.message
            }`
          );
        }
      }
      this.visible = cards;
    } else {
      throw NotAvailableMethod;
    }
  }

  /**
   * Change lastCard performance. Method only available for "pile" kind.
   * @param {Boolean} newState True: last card visible. False: last card not visible.
   */
  set lastVisible(newState) {
    if (this.kind != "pile") {
      throw NotAvailableMethod;
    } else {
      if (newState) {
        this.visible[0] = this.cards[this.cards.length - 1];
      } else {
        this.visible = [];
      }
    }
  }

  /*================================================================================================
  -------------------------------------------METHODS------------------------------------------------
  =================================================================================================*/

  /**
   * Returns the visibility state of a card
   * @param {Card | Number} card Index or card of the hand
   * True: visible for all. False: only visible for the card owner
   */
  isVisible(card) {
    switch (card.constructor.name) {
      case "Number":
        if (card >= this.cards.length) {
          throw OutOfArray;
        } else {
          let aux_card = this.cards[card];
          let visible_index = this.visible.indexOf(aux_card);
          if (visible_index == -1) {
            return false;
          } else {
            return true;
          }
        }
      case "Card":
        let card_index = this.cards.indexOf(card);
        if (card_index == -1) {
          throw OutOfArray;
        } else {
          let visible_index = this.visible.indexOf(card);
          if (visible_index == -1) {
            return false;
          } else {
            return true;
          }
        }
      default:
        throw NotANumberNorCard;
    }
  }

  /**
   * Add a card to a hand. If it is a table Hand, it will be set as visible.
   * If it is a pile Hand and it have 1 visible item, it will set the new card as
   * the visible one.
   * @param {Card} card
   */
  addCard(card) {
    if (card.constructor.name != "Card") {
      throw NotACard;
    }
    this.cards.push(card);
    switch (this.kind) {
      case "table":
        this.visible.push(card);
        break;
      case "pile":
        if (this.visible.length == 1) {
          this.visible[0] = card;
        }
        break;
    }
  }

  /**
   * Add multiple cards to a hand
   * @param {Array<Card>} cards
   */
  addCards(cards) {
    for (let card of cards) {
      if (card.constructor.name != "Card") {
        throw new Error(
          `Error at element ${cards.indexOf(card)} \n ${NotACard.error} ${
            NotACard.message
          }`
        );
      }
    }
    this.cards = [...this.cards, ...cards];
    switch (this.kind) {
      case "table":
        this.visible = [...this.visible, ...cards];
        break;
      case "pile":
        if (this.visible.length == 1) {
          this.visible[0] = cards[cards.length - 1];
        }
        break;
    }
  }

  /**
   * Remove a single card of a hand
   * @param {Card | Number} card Index or card that you want to remove from a hand
   */
  removeCard(card) {
    switch (card.constructor.name) {
      case "Number":
        if (card >= this.cards.length) {
          throw OutOfArray;
        }
        // Get the card that we're going to delete
        let aux_card = this.card(card);
        this.cards.splice(card, 1);
        let visible_index = this.visible.indexOf(aux_card);
        if (
          card == this.cards.length &&
          this.kind == "pile" &&
          this.visible.length == 1
        ) {
          this.visible[0] = this.cards[this.cards.length - 1];
        } else if (visible_index != -1) {
          this.visible.splice(visible_index, 1);
        }
        break;
      case "Card":
        let cards_index = this.cards.indexOf(card);
        if (cards_index == -1) {
          throw NotAvailableCard;
        } else {
          this.cards.splice(cards_index, 1);
        }
        let visible_index = this.visible.indexOf(card);
        if (
          cards_index == this.cards.length &&
          this.kind == "pile" &&
          this.visible.length == 1
        ) {
          this.visible[0] = this.cards[this.cards.length - 1];
        } else if (visible_index != -1) {
          this.visible.splice(visible_index, 1);
        }
        break;
      default:
        throw NotANumberNorCard;
    }
  }

  /**
   * Remove multiple elements from a hand
   * @param {Array<Card> | Array<Number>} cards
   */
  removeCards(cards) {
    switch (cards[0].constructor.name) {
      case "Card":
        let cards_index = [];

        for (let card of cards) {
          if (card.constructor.name != "Card") {
            throw new Error(
              `Error at element ${cards.indexOf(card)} \n ${NotACard.error} ${
                NotACard.message
              }`
            );
          } else {
            let aux_index = this.cards.indexOf(card);
            if (aux_index == -1) {
              throw new Error(
                `Error at element ${cards.indexOf(card)} \n ${
                  NotAvailableCard.error
                } ${NotAvailableCard.message}`
              );
            } else {
              cards_index.push(aux_index);
            }
          }
        }

        break;

      case "Number":
        let cards_array = [];

        for (let card of cards) {
          if (!Number.isInteger) {
            throw new Error(
              `Error at element ${cards.indexOf(card)} \n ${NotANumber.error} ${
                NotANumber.message
              }`
            );
          } else {
            if (card >= this.cards.length) {
              throw new Error(
                `Error at element ${cards.indexOf(card)} \n ${
                  OutOfArray.error
                } ${OutOfArray.message}`
              );
            } else {
              let aux_card = this.card(card);
              cards_array.push(aux_card);
            }
          }
        }
        break;
      default:
        throw NotANumberNorCard;
    }

    let pileLastCard = this.kind == "pile" && this.visible.length == 1;

    switch (cards[0].constructor.name) {
      case "Card":
        for (let index in cards_index) {
          delete this.cards[index];
        }

        for (let card in cards) {
          let visible_index = this.visible.indexOf(card);
          if (visible_index != -1) {
            delete this.visible[visible_index];
          }
        }
        break;
      case "Number":
        for (let index of cards) {
          delete this.cards[index];
        }
        for (let card of cards_array) {
          let visible_index = this.visible.indexOf(card);
          if (visible_index != -1) {
            delete this.visible[visible_index];
          }
        }
        break;
    }

    // Remove empty items from this.cards
    this.cards.filter(function () {
      return true;
    });

    // Remove empty items from this.visible
    this.visible.filter(function () {
      return true;
    });

    // Update last visible element for pile hands
    if (pileLastCard) {
      this.visible[0] = this.cards[length - 1];
    }
    break;
  }

  /**
   * Toggles the visibility of a card and returns the new state
   * @param {Card | Number} card
   */
  toggleVisibility(card) {
    switch (card.constructor.name) {
      case "Number":
        if (cart >= this.cards.length) {
          throw OutOfArray;
        }
        let aux_card = this.card(card);
        let visibility_index = this.visible.indexOf(aux_card);
        if (visibility_index == -1) {
          this.visible.push(aux_card);
          return "Visible";
        } else {
          this.visible.splice(visibility_index, 1);
          return "Not visible";
        }
      case "Card":
        let cards_index = this.cards.indexOf(card);
        if (cards_index == -1) {
          throw NotAvailableCard;
        } else {
          let visibility_index = this.visible.indexOf(cards_index);
          if (visibility_index == -1) {
            this.visible.push(cards_index);
            return "Visible";
          } else {
            this.visible.splice(visibility_index, 1);
            return "Not visible";
          }
        }
      default:
        throw NotANumberNorCard;
    }
  }
  /**
   * Shuffle the hand.
   */
  shuffle() {
    this.sort(() => Math.random() - 0.5);
  }
}
