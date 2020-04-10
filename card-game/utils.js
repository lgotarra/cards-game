/*================================================================================================
==================================================================================================
==================================================================================================
This file contains all the util functions required for the game model. 
==================================================================================================
==================================================================================================
=================================================================================================*/
import ".classes.js";

/*
 * TODO:
 * Compare hands of different players
 */

/*=================================================================================================
  ----------------------------------------USEFUL FUNCTIONS-----------------------------------------
  =================================================================================================*/

/**
 * Returns a random integer from 0 to a certain maximum
 * @param {Number} max Maximum range of the random numbers
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Returns a requested number of random integers from 0 to a certain maximum
 * @param {Number} max Maximum range of the random numbers
 * @param {Number} quantity Number of randoms that we want
 */
function getRandomIntNoRepeat(max, quantity) {
  let i = 0;
  let random = [];
  let aux;
  while (i < quantity) {
    aux = getRandomInt(max);
    if (random.indexOf(aux) == -1) {
      random.push(aux);
      i++;
    }
  }
  return random;
}

/**
 * Converts Strings to Integer based on the Blackjack cards value
 * @param {String} n String to convert
 */
function stringToInt(n) {
  if (n != "jack" || n != "queen" || n != "king" || n != "ace") {
    n = parseInt(n);
  } else {
    if (n == "jack" || n == "queen" || n == "king") {
      n = 10;
    } else {
      n = 11;
    }
  }
}

sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

/*=================================================================================================
  ----------------------------------------UTILS TO EXPORT------------------------------------------
  =================================================================================================*/

/**
 * Returns the visible cards for a certain hand.
 * @param {Hand} activeHand Active hand
 * @param {Array<Hand>} allHands All the other hands of the game
 */
function getVisible(activeHand, allHands) {
  let visibleCards = [[activeHand.name(), activeHand.visible()]];
  for (let hand of allHands) {
    if (hand.visible().length != 0) {
      visibleCards.push([hand.name(), hand.visible()]);
    }
  }
  return visibleCards;
}

/**
 * Deal random cards to a certain hand from a deck of cards.
 * @param {Hand} deck Deck of cards. Usually kind = "pile"
 * @param {Hand} hand Active hand
 * @param {Number} quantity Number of cards to add to the hand
 */
function dealHand(deck, hand, quantity) {
  if (quantity < deck.cards().length) {
    let cards_indexs = getRandomIntNoRepeat(deck.cards().length, quantity);
    let cards = [];
    for (i of cards_indexs) {
      cards.push(deck.getCard(i));
    }
    deck.removeCards(cards_indexs);
    hand.addCards(cards);
  } else {
    throw OutOfArray;
  }
}

/**
 * Deal random cards to multiple hands at once.
 * @param {Hand} deck Deck of cards. Usually kind = "pile"
 * @param {Array<Hand>} hands Hands that we want to deal new cards
 * @param {Number} quantity Number of cards that we want to add
 */
function dealHands(deck, hands, quantity) {
  if (quantity * hands.length < deck.cards().length) {
    for (hand of hands) {
      dealHand(deck, hand, quantity);
    }
  } else {
    throw OutOfArray;
  }
}

/**
 * Compare two hands and returns the winner name
 * @param {Hand} a Hand to compare
 * @param {Hand} b Hand to compare
 */
function compareHandsBlackjack(a, b) {
  let cards_a = a.cards();
  let values_a = [];
  for (card of cards_a) {
    values_a.push(card.value);
  }
  let cards_b = b.cards();
  let values_b = [];
  for (card of cards_b) {
    values_b.push(card.value);
  }

  values_a.map((n) => stringToInt(n));
  values_b.map((n) => stringToInt(n));

  total_a = sumArray(values_a);
  total_b = sumArray(values_b);

  values = [total_a, total_b];

  switch (values) {
    case values[0] > 21 && values[1] > 21:
      return "Nobody wins";
    case values[0] > 21 && values[2] < 21:
      return `${b.name()} wins`;
    case values[0] < 21 && values[2] > 21:
      return `${a.name()} wins`;
    case values[0] < 21 && values[2] < 21:
      let a_dif = 21 - values[0];
      let b_dif = 21 - values[1];
      if (a_dif < b_dif) {
        return `${a.name()} wins`;
      } else if (a_dif > b_dif) {
        return `${b.name()} wins`;
      } else {
        return "Draw";
      }
  }
}
