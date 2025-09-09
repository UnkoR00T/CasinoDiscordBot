import type { ChatInputCommandInteraction } from "discord.js";
import { EmbedsRegistry } from "../../embeds/embeds";
import { getItemByName, ITEMS, type Item } from "../../types/inventory";
import { InventoryController, UsersController } from "../../db/users";
import { BALANCE_DELTA } from "../../types/balance_delta";

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
  if (action === "buy") {
    let bal = UsersController.getBalance(interaction.user.id);
    if (bal < amount * item.price) {
      interaction.reply({
        embeds: [
          EmbedsRegistry.ERRORS.NOT_ENOUGH_MONEY(bal, amount * item.price),
        ],
        flags: "Ephemeral",
      });
      return;
    }
    let inv = InventoryController.getInventory(interaction.user.id);
    console.log(inv);
    let inv_item = inv.find((x) => x.item.name === item.name);
    if (inv_item) {
      inv_item.quantity += amount;
    } else {
      inv.push({
        item: item,
        quantity: amount,
      });
    }
    InventoryController.setInventory(interaction.user.id, inv);
    let transfer = UsersController.changeAmount(
      interaction.user.id,
      BALANCE_DELTA.REMOVE,
      amount * item.price,
    );
    if (transfer) {
      interaction.reply({
        embeds: [
          EmbedsRegistry.SERVER_TRANSFER("Buy", interaction.user, transfer),
        ],
        flags: "Ephemeral",
      });
    }
  } else if (action === "sell") {
    let inv = InventoryController.getInventory(interaction.user.id);
    let inv_item = inv.find((x) => x.item.name === item.name);
    if (inv_item && inv_item?.quantity >= amount) {
      inv_item.quantity -= amount;
      InventoryController.setInventory(interaction.user.id, inv);
      let transfer = UsersController.changeAmount(
        interaction.user.id,
        BALANCE_DELTA.ADD,
        (amount * item.price) / 3,
      );
      if (transfer) {
        interaction.reply({
          embeds: [
            EmbedsRegistry.SERVER_TRANSFER("Sell", interaction.user, transfer),
          ],
          flags: "Ephemeral",
        });
        return;
      }
    } else {
      interaction.reply({
        content: "U dont have enough item to sell.",
        flags: "Ephemeral",
      });
      return;
    }
  }
};
