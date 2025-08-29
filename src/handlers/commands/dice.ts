import type { ChatInputCommandInteraction } from "discord.js";
import { getDiceByName } from "../../types/dice_types";
import { UsersController } from "../../db/users";
import { BALANCE_DELTA } from "../../types/balance_delta";
import { EmbedsRegistry } from "../../embeds/embeds";
import type { transferInfo } from "../../types/transfer";

export const diceHandler = (interaction: ChatInputCommandInteraction) => {
  let dice_name = interaction.options.getString("roll_type");
  let amount = interaction.options.getNumber("amount");
  if (!dice_name || !amount) return;
  let dice = getDiceByName(dice_name);
  if (!dice) return;
  let random = Math.floor(Math.random() * 99);
  let bal = UsersController.getBalance(interaction.user.id);
  if (bal < amount) {
    interaction.reply({
      embeds: [EmbedsRegistry.ERRORS.NOT_ENOUGH_MONEY(bal, amount)],
      flags: "Ephemeral",
    });
    return;
  }
  let transfer: null | transferInfo = null;
  if (random < dice.chance) {
    transfer = UsersController.changeAmount(
      interaction.user.id,
      BALANCE_DELTA.ADD,
      amount * dice.mult,
    );
  } else {
    transfer = UsersController.changeAmount(
      interaction.user.id,
      BALANCE_DELTA.REMOVE,
      amount,
    );
  }
  if (!transfer) return;
  interaction.reply({
    embeds: [EmbedsRegistry.DICE(random, transfer)],
  });
};
