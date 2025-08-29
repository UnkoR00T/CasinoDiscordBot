import { Client, Events, GatewayIntentBits } from "discord.js";
import { registry } from "./handlers/commands_handler";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const initClient = (token: string) => {
  client.on(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
  });
  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) {
      registry.registryBlock.commands
        .find((x) => x.name === interaction.commandName)
        ?.callback(interaction);
    }
    if (interaction.isButton()) {
      registry.registryBlock.buttons
        .find((x) => x.id === interaction.id)
        ?.callback(interaction);
    }
  });

  client.login(token);
};
export { client, initClient };
