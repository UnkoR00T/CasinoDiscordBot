import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  codeBlock,
  ComponentType,
  User,
  type ChatInputCommandInteraction,
} from "discord.js";
import { UsersController } from "../../db/users";
import { EmbedsRegistry } from "../../embeds/embeds";
import { blackJackManager, blackJackStore } from "../../stores/blackjackStore";
import { ButtonRegistry } from "../../types/buttons";
import { BlackjackGame } from "../../types/blackjack";
import { BALANCE_DELTA } from "../../types/balance_delta";
import type { transferInfo } from "../../types/transfer";

export const blackjackHandler = async (
  interaction: ChatInputCommandInteraction,
) => {
  let bal = UsersController.getBalance(interaction.user.id);
  let amount = interaction.options.getNumber("amount");
  if (!amount) return;
  if (amount > bal) {
    interaction.reply({
      embeds: [EmbedsRegistry.ERRORS.NOT_ENOUGH_MONEY(bal, amount)],
      flags: "Ephemeral",
    });
    return;
  }
  let game = blackJackManager.create(interaction.user, amount, interaction);
  const action_row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    ButtonRegistry.hit,
    ButtonRegistry.stand,
  );
  let formated: string[] = [];
  game.player.cards.map((x) => {
    formated.push(`${x.suit}${x.rank}`);
  });
  let reply = await interaction.reply({
    embeds: [EmbedsRegistry.BLACKJACK_GAME(game)],
    components: [action_row],
  });
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60_000,
  });
  collector.on("collect", async (btnInteraction: ButtonInteraction) => {
    if (btnInteraction.user.id !== interaction.user.id) {
      btnInteraction.reply({
        content: "Not yours!",
        flags: "Ephemeral",
      });
      return;
    }
    if (btnInteraction.customId === "hit") {
      game.hit(game.player);
      if (game.player.getValue() >= 21) {
        finishGame(game, btnInteraction);
        collector.stop("finished");
        return;
      }
      await btnInteraction.update({
        embeds: [EmbedsRegistry.BLACKJACK_GAME(game)],
        components: [action_row],
      });
    }
    if (btnInteraction.customId === "stand") {
      finishGame(game, btnInteraction);
      collector.stop("finished");
    }
  });
};
const finishGame = async (
  game: BlackjackGame,
  btnInteraction: ButtonInteraction,
) => {
  game.dealerTurn();
  const result = game.getWinner();
  let transfer: transferInfo | null = null;
  if (result === "player") {
    transfer = UsersController.changeAmount(
      btnInteraction.user.id,
      BALANCE_DELTA.ADD,
      game.bet,
    );
  } else if (result === "dealer") {
    transfer = UsersController.changeAmount(
      btnInteraction.user.id,
      BALANCE_DELTA.REMOVE,
      game.bet,
    );
  }
  if (!transfer) {
    btnInteraction.update({
      content: "Cos sie bardzo zepsulo XDDD",
    });
    return;
  }
  await btnInteraction.update({
    embeds: [
      EmbedsRegistry.BLACKJACK_GAME(game),
      EmbedsRegistry.SERVER_TRANSFER(
        "Blackjack",
        btnInteraction.user,
        transfer,
      ),
    ],
    components: [], // usuwamy przyciski po końcu
  });
};
