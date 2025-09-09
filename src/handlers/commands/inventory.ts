import type { ChatInputCommandInteraction } from "discord.js";
import { InventoryController } from "../../db/users";
import { EmbedsRegistry } from "../../embeds/embeds";

export const inventoryHandler = (interaction: ChatInputCommandInteraction) => {
  let target = "";
  let user = interaction.options.getUser("target");
  if (user) {
    target = user.id;
  } else {
    target = interaction.user.id;
  }
  let inventory = InventoryController.getInventory(target);
  interaction.reply({
    embeds: [EmbedsRegistry.SHOP.INVENTORY_DISPLAY(inventory)],
    flags: "Ephemeral",
  });
  return;
};
