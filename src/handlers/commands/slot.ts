import { User, type ChatInputCommandInteraction } from "discord.js";
import { DEFAULT_SLOT_ENGINE } from "../../types/slots_engine";
import type { transferInfo } from "../../types/transfer";
import { UsersController } from "../../db/users";
import { BALANCE_DELTA } from "../../types/balance_delta";
import { EmbedsRegistry } from "../../embeds/embeds";

export const slotHandler = (interaction: ChatInputCommandInteraction) => {
  let amount = interaction.options.getNumber("amount");
  if (!amount) return;
  let bal = UsersController.getBalance(interaction.user.id);
  if (bal < amount) {
    interaction.reply({
      embeds: [EmbedsRegistry.ERRORS.NOT_ENOUGH_MONEY(bal, amount)],
      flags: "Ephemeral",
    });
    return;
  }
  let res = DEFAULT_SLOT_ENGINE.spin({ betPerLine: amount / 15, lines: 15 });
  let delta = Math.floor(res.totalWin) - amount;
  let transfer: transferInfo | null;
  if (delta >= 0) {
    transfer = UsersController.changeAmount(
      interaction.user.id,
      BALANCE_DELTA.ADD,
      delta,
    );
  } else {
    transfer = UsersController.changeAmount(
      interaction.user.id,
      BALANCE_DELTA.REMOVE,
      Math.abs(delta),
    );
  }
  if (!transfer) {
    interaction.reply({
      content: "Cos sie znowu jeblo",
      flags: "Ephemeral",
    });
    return;
  }
  interaction.reply({
    embeds: [
      EmbedsRegistry.SLOT_WINDOW(res),
      EmbedsRegistry.SERVER_TRANSFER("Slot", interaction.user, transfer),
    ],
  });
};
