import { REST, Routes } from "discord.js";
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
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, balance INTEGER)",
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
