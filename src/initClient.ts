import {
  Client,
  Events,
  GatewayIntentBits,
  spoiler,
  TextChannel,
} from "discord.js";
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
  client.on(Events.ClientReady, async (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
    try {
      let channel = await client.channels.fetch("1411019046597431336");
      let role = "1412417908172259379";
      (channel as TextChannel).send({
        content: `<@&${role}> Bot sie zrestartował, chyba Update. ${spoiler("Restart hajsu do 1000$")}`,
      });
    } catch (err) {
      console.error(err);
    }
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
