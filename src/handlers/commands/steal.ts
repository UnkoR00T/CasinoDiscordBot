import { type ChatInputCommandInteraction } from "discord.js";
import { UsersController } from "../../db/users";
import { BALANCE_DELTA } from "../../types/balance_delta";
import { EmbedsRegistry } from "../../embeds/embeds";
import { client } from "../../initClient";

export const stealHandler = (interaction: ChatInputCommandInteraction) => {
  let target = interaction.options.getUser("target");
  if (!target) return;
  let bal = UsersController.getBalance(target.id);
  if (!bal) return;
  let max = bal * 0.5;
  let rand = Math.floor(Math.random() * max);
  let transfer = UsersController.changeAmount(
    target.id,
    BALANCE_DELTA.REMOVE,
    rand,
  );
  if (transfer) {
    let to = UsersController.changeAmount(
      interaction.user.id,
      BALANCE_DELTA.ADD,
      rand,
    );
    if (!to) {
      UsersController.changeAmount(target.id, BALANCE_DELTA.ADD, rand);
      return;
    }
    interaction.reply({
      embeds: [
        EmbedsRegistry.TRANSFER(
          "Theft",
          { user: target, transfer: transfer },
          { user: interaction.user, transfer: to },
        ),
      ],
    });
    client.users.send(target.id, {
      content: `User ${interaction.user.displayName} stole ${rand}₣ from you.`,
    });
  }
};
