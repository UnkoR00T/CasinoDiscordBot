import type { ChatInputCommandInteraction, User } from "discord.js";
import { EmbedsRegistry } from "../../embeds/embeds";
import { UsersController } from "../../db/users";
import { BALANCE_DELTA } from "../../types/balance_delta";
import type { transferInfo } from "../../types/transfer";

export const payHandler = (interaction: ChatInputCommandInteraction) => {
  let target: User | null = interaction.options.getUser("target");
  let amount: number | null = interaction.options.getNumber("amount");
  if (!amount || amount <= 0 || !target) {
    interaction.reply({
      content: "Correct usage: /pay <target> <amount>",
      embeds: [EmbedsRegistry.ERRORS.INCORRECT_USAGE(interaction.commandName)],
      flags: "Ephemeral",
    });
    return;
  }

  let transfer_sender: null | transferInfo = UsersController.changeAmount(
    interaction.user.id,
    BALANCE_DELTA.REMOVE,
    amount,
  );
  if (transfer_sender) {
    let transfer_reciver: null | transferInfo = UsersController.changeAmount(
      target.id,
      BALANCE_DELTA.ADD,
      amount,
    );
    if (transfer_reciver) {
      interaction.reply({
        embeds: [
          EmbedsRegistry.TRANSFER(
            "Transfer",
            { user: interaction.user, transfer: transfer_sender },
            { user: target, transfer: transfer_reciver },
          ),
        ],
      });
    }
  } else {
    interaction.reply({
      embeds: [
        EmbedsRegistry.ERRORS.NOT_ENOUGH_MONEY(
          UsersController.getBalance(interaction.user.id),
          amount,
        ),
      ],
      flags: "Ephemeral",
    });
    return;
  }
};
