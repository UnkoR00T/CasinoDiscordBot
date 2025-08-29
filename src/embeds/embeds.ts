import { codeBlock, EmbedBuilder, inlineCode, User } from "discord.js";
import type { transferInfo } from "../types/transfer";
import type { BlackjackGame, Deck } from "../types/blackjack";

export const EmbedsRegistry = {
  ERRORS: {
    INCORRECT_USAGE: (name: string) =>
      new EmbedBuilder()
        .setTitle("Incorrect usage")
        .setColor(0xff0000)
        .setDescription(`Command ${name} was used incorrectly!`),
    NOT_ENOUGH_MONEY: (balance: number, needed: number) =>
      new EmbedBuilder()
        .setTitle("Not enough money")
        .setColor(0xff0000)
        .setDescription(inlineCode(`${needed}₣ > ${balance}₣`))
        .setFooter({ text: "₣ - Fifonż Coins" }),
  },
  BALANCE: (balance: number, username: string) =>
    new EmbedBuilder()
      .setTitle(`Bank`)
      .setColor(0xff0000)
      .addFields({
        name: `Balance of ${username}`,
        value: `${balance}₣`,
      })
      .setFooter({ text: "₣ - Fifonż Coins" }),
  TRANSFER: (
    title: string,
    from: { user: User; transfer: transferInfo },
    to: { user: User; transfer: transferInfo },
  ) =>
    new EmbedBuilder()
      .setTitle(title)
      .setColor(0x00ff00)
      .addFields(
        {
          name: `${from.user.displayName}`,
          value: codeBlock(
            "ansi",
            `[2;31m[0m[2;31m[2;32m[2;36m[2;31m ${from.transfer.before}₣ -> ${from.transfer.after}₣  \n ${from.transfer.after - from.transfer.before}₣ [0m[2;36m[0m[2;32m[0m[2;31m[0m`,
          ),
          inline: true,
        },
        {
          name: `${to.user.displayName}`,
          value: codeBlock(
            "ansi",
            `[2;31m[0m[2;31m[2;32m[2;36m ${to.transfer.before}₣ -> ${to.transfer.after}₣ \n +${to.transfer.after - to.transfer.before}₣ [0m[2;32m[0m[2;31m[0m`,
          ),
          inline: true,
        },
      )
      .setFooter({ text: "₣ - Fifonż Coins" }),
  SERVER_TRANSFER: (title: string, user: User, transfer: transferInfo) => {
    let embed = new EmbedBuilder().setTitle(title);
    if (transfer.after - transfer.before < 0) {
      embed
        .setColor(0xff0000)
        .setFields({
          name: `${user.displayName}`,
          value: codeBlock(
            "ansi",
            `[2;31m[0m[2;31m[2;32m[2;36m[2;31m ${transfer.before}₣ -> ${transfer.after}₣  \n ${transfer.after - transfer.before}₣ [0m[2;36m[0m[2;32m[0m[2;31m[0m`,
          ),
          inline: true,
        })
        .setFooter({ text: "₣ - Fifonż Coins" });
    } else {
      embed
        .setColor(0x00ff00)
        .setFields({
          name: `${user.displayName}`,
          value: codeBlock(
            "ansi",
            `[2;31m[0m[2;31m[2;32m[2;36m ${transfer.before}₣ -> ${transfer.after}₣ \n +${transfer.after - transfer.before}₣ [0m[2;32m[0m[2;31m[0m`,
          ),
          inline: true,
        })
        .setFooter({ text: "₣ - Fifonż Coins" });
    }
    return embed;
  },
  DICE: (rolled: number, transfer: transferInfo) => {
    let embed = new EmbedBuilder().setTitle(`Dice`);
    if (transfer.after - transfer.before > 0) {
      embed
        .setColor(0x00ff00)
        .setFields({
          name: `Rolled: ${rolled}`,
          value: codeBlock(
            "ansi",
            `[2;31m[0m[2;31m[2;32m[2;36m ${transfer.before}₣ -> ${transfer.after}₣ \n +${transfer.after - transfer.before}₣ [0m[2;32m[0m[2;31m[0m`,
          ),
          inline: true,
        })
        .setFooter({ text: "₣ - Fifonż Coins" });
    } else {
      embed
        .setColor(0xff0000)
        .setFields({
          name: `Rolled: ${rolled}`,
          value: codeBlock(
            "ansi",
            `[2;31m[0m[2;31m[2;32m[2;36m[2;31m ${transfer.before}₣ -> ${transfer.after}₣  \n ${transfer.after - transfer.before}₣ [0m[2;36m[0m[2;32m[0m[2;31m[0m`,
          ),
          inline: true,
        })
        .setFooter({ text: "₣ - Fifonż Coins" });
    }
    return embed;
  },
  BLACKJACK_GAME: (game: BlackjackGame): EmbedBuilder => {
    let embed = new EmbedBuilder().setTitle("Blackjack Game");

    const updated = game.player.cards.map((x) => `${x.suit}${x.rank}`);

    const dealerCards = game.dealer.cards.map((x) => `${x.suit}${x.rank}`);
    if (game.ended) {
      let color =
        game.getWinner() === "player"
          ? 0x00ff00
          : game.getWinner() === "dealer"
            ? 0xff0000
            : 0xffff00;
      embed.setColor(color).setFields(
        {
          name: `Dealer: ${game.dealer.getValue()}`,
          value: codeBlock(dealerCards.join(" | ")),
        },
        {
          name: `Player: ${game.player.getValue()}`,
          value: codeBlock(updated.join(" | ")),
        },
        {
          name: `Winner: ${game.getWinner().toUpperCase()}`,
          value: "",
        },
      );
      return embed;
    } else {
      embed.setColor(0x0000ff).setFields(
        {
          name: `Dealer: ??`,
          value: codeBlock(dealerCards[0] + " ??"),
        },
        {
          name: `Player: ${game.player.getValue()}`,
          value: codeBlock(updated.join(" | ")),
        },
      );
      return embed;
    }
  },
};
