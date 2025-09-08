import type { ChatInputCommandInteraction } from "discord.js";
import { EmbedsRegistry } from "../../embeds/embeds";
import { getItemByName, ITEMS, type Item } from "../../types/inventory";

export const shopHandler = (interaction: ChatInputCommandInteraction) => {
  const item_name = interaction.options.getString("item_name");
  const amount = interaction.options.getNumber("amount");
  const action = interaction.options.getString("action");
  if (!item_name) {
    interaction.reply({
      embeds: [EmbedsRegistry.SHOP.SHOP_DISPLAY()],
      flags: "Ephemeral",
    });
    return;
  }
  let item: Item | undefined = getItemByName(item_name);
  if (!item) {
    interaction.reply({
      content: `${item_name} not found.`,
      embeds: [EmbedsRegistry.SHOP.SHOP_DISPLAY()],
      flags: "Ephemeral",
    });
    return;
  }
  if (!amount) {
    interaction.reply({
      embeds: [EmbedsRegistry.SHOP.SHOP_ITEM(item)],
      flags: "Ephemeral",
    });
    return;
  }
  if (!action) {
    interaction.reply({
      embeds: [EmbedsRegistry.SHOP.SHOP_CHECKOUT(item, amount)],
      flags: "Ephemeral",
    });
    return;
  }
};
