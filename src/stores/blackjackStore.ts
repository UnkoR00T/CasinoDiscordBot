import type { ChatInputCommandInteraction, User } from "discord.js";
import { BlackjackGame } from "../types/blackjack";

export const blackJackStore: {
  state: { user: String; blackjack: BlackjackGame }[];
} = {
  state: [],
} as const;
export const blackJackManager = {
  get: (user: User): BlackjackGame | undefined => {
    return blackJackStore.state.find((x) => x.user === user.id)?.blackjack;
  },
  create: (
    user: User,
    bet: number,
    inter: ChatInputCommandInteraction,
  ): BlackjackGame => {
    let game = blackJackManager.get(user);
    if (game) {
      if (!game.ended) return game;
    }
    let new_game = {
      user: user.id,
      blackjack: new BlackjackGame(bet, inter),
    };
    blackJackStore.state.push(new_game);
    return new_game.blackjack;
  },
};
