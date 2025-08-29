import type { ChatInputCommandInteraction } from "discord.js";

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  suit: Suit;
  rank: Rank;
}

class Deck {
  private cards: Card[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    const suits: Suit[] = ["♠", "♥", "♦", "♣"];
    const ranks: Rank[] = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];

    this.cards = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push({ suit, rank });
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // @ts-ignore
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card | undefined {
    return this.cards.pop();
  }
}

class Hand {
  cards: Card[] = [];

  addCard(card: Card) {
    this.cards.push(card);
  }

  getValue(): number {
    let value = 0;
    let aces = 0;

    for (const card of this.cards) {
      if (card.rank === "A") {
        value += 11;
        aces++;
      } else if (["K", "Q", "J"].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank, 10);
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }

  isBust(): boolean {
    return this.getValue() > 21;
  }
}

class BlackjackGame {
  ended: boolean = false;
  interaction: ChatInputCommandInteraction | null = null;
  bet: number = 0;
  private deck: Deck;
  player: Hand;
  dealer: Hand;

  constructor(bet: number, interaction: ChatInputCommandInteraction) {
    this.deck = new Deck();
    this.deck.shuffle();
    this.player = new Hand();
    this.dealer = new Hand();
    this.bet = bet;
    this.interaction = interaction;

    // Initial deal
    this.player.addCard(this.deck.draw()!);
    this.dealer.addCard(this.deck.draw()!);
    this.player.addCard(this.deck.draw()!);
    this.dealer.addCard(this.deck.draw()!);
  }

  hit(hand: Hand) {
    hand.addCard(this.deck.draw()!);
  }

  dealerTurn() {
    while (this.dealer.getValue() < 17) {
      this.hit(this.dealer);
    }
  }

  getWinner(): "player" | "dealer" | "push" {
    const playerValue = this.player.getValue();
    const dealerValue = this.dealer.getValue();
    this.ended = true;
    if (this.player.isBust()) return "dealer";
    if (this.dealer.isBust()) return "player";
    if (playerValue > dealerValue) return "player";
    if (dealerValue > playerValue) return "dealer";
    return "push";
  }
}
export { BlackjackGame, Deck, Hand, type Suit, type Card, type Rank };

// Example usage
/*
const game = new BlackjackGame();
console.log("Player:", game.player.cards, "Value:", game.player.getValue());
console.log("Dealer:", game.dealer.cards, "Value:", game.dealer.getValue());

game.hit(game.player); // Player hits
console.log(
  "Player after hit:",
  game.player.cards,
  "Value:",
  game.player.getValue(),
);

game.dealerTurn();
console.log(
  "Dealer final:",
  game.dealer.cards,
  "Value:",
  game.dealer.getValue(),
);

console.log("Winner:", game.getWinner());
*/
