import type { ChatInputCommandInteraction, User } from "discord.js";
import { UsersController } from "../../db/users";
import { EmbedsRegistry } from "../../embeds/embeds";

export const balanceHandler = (interaction: ChatInputCommandInteraction) => {
  let target: User | null = interaction.options.getUser("target");
  let user = {
    name: "",
    id: "",
  };
  if (target) {
    user.id = target.id;
    user.name = target.displayName;
  } else {
    user.id = interaction.user.id;
    user.name = interaction.user.displayName;
  }
  let balance = UsersController.getBalance(user.id);
  interaction.reply({
    embeds: [EmbedsRegistry.BALANCE(balance, user.name)],
    withResponse: true,
    flags: ["Ephemeral"],
  });
};
