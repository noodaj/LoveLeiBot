import { Client } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import { BotEvent } from "../types";
import { VoicePlayer } from "../player";
import { createAudioPlayer } from "@discordjs/voice";

const helperPath = join(__dirname, "..");
const eventsPath = join(helperPath, "events");

const execute = (client: Client) => {
  readdirSync(eventsPath).forEach((file) => {
    if (!file.endsWith(".js")) {
      return;
    }

    const player: VoicePlayer = new VoicePlayer(undefined, createAudioPlayer());

    const event: BotEvent = require(`${eventsPath}/${file}`).default;
    event?.once
      ? client.once(event.name, (...args) => event.execute(player, ...args))
      : client.on(event.name, (...args) => event.execute(player, ...args));
  });

  console.log("Events successfully set");
};

export default execute;
