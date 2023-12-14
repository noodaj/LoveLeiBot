import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import deploy from "./deploy";
import execute from "./event";

export const client = new Client({
  intents: [
    "GuildMessages",
    "Guilds",
    "DirectMessages",
    GatewayIntentBits.Guilds,
  ],
});
//extend the client type to add commands
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  deploy(client);
  execute(client);
});

client.login(config.DISCORD_TOKEN);
