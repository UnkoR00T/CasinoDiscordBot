import { REST, Routes, User } from "discord.js";
import { commands } from "./src/commands";
import { db } from "./src/db";
import { registry } from "./src/handlers/commands_handler";
import { balanceHandler } from "./src/handlers/commands/balance";
import { payHandler } from "./src/handlers/commands/pay";
import { workHandler } from "./src/handlers/commands/work";
import { diceHandler } from "./src/handlers/commands/dice";
import { stealHandler } from "./src/handlers/commands/steal";
import { initClient } from "./src/initClient";
import { blackjackHandler } from "./src/handlers/commands/blackjack";
import { slotHandler } from "./src/handlers/commands/slot";
import { shopHandler } from "./src/handlers/commands/shop";
import { InventoryController, UsersController } from "./src/db/users";
import { BALANCE_DELTA } from "./src/types/balance_delta";
import { inventoryHandler } from "./src/handlers/commands/inventory";
const token: string | undefined = process.env.TOKEN;
if (!token) {
  console.error("TOKEN not found!");
  process.exit(0);
}
const client_id: string | undefined = process.env.CLIENT_ID;
if (!client_id) {
  console.log("CLIENT_ID not found!");
  process.exit(0);
}

initClient(token);

const init_utils = async () => {
  try {
    register_commands(token, client_id);
    console.log("Commands updated!");
  } catch (err) {
    console.log(err);
  }
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, balance INTEGER, inventory TEXT)",
  );
};
const register_commands = async (token: string, client_id: string) => {
  const rest = new REST({ version: "10" }).setToken(token);
  await rest.put(Routes.applicationCommands(client_id), { body: commands });
};
await init_utils();

registry.registerCommand("balance", balanceHandler);
registry.registerCommand("pay", payHandler);
registry.registerCommand("work", workHandler);
registry.registerCommand("dice", diceHandler);
registry.registerCommand("steal", stealHandler);
registry.registerCommand("blackjack", blackjackHandler);
registry.registerCommand("slot", slotHandler);
registry.registerCommand("shop", shopHandler);
registry.registerCommand("inventory", inventoryHandler);

// Inventory main Loop
setInterval(
  () => {
    let invs = InventoryController.getInventoryes();
    invs.forEach((x) => {
      x.inv.forEach((item) => {
        let random =
          Math.floor(Math.random() * (item.item.max - item.item.min + 1)) +
          item.item.min;
        let amount = random * item.quantity;
        let transfer = UsersController.changeAmount(
          x.id,
          BALANCE_DELTA.ADD,
          amount,
        );
        console.log(`${x.id}: Added: ${amount}`);
      });
    });
  },
  60 * 60 * 1000,
);
