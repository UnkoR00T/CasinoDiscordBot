import { ButtonBuilder, ButtonStyle } from "discord.js";

export const ButtonRegistry = {
  hit: new ButtonBuilder()
    .setCustomId("hit")
    .setLabel("Hit")
    .setStyle(ButtonStyle.Success),
  stand: new ButtonBuilder()
    .setCustomId("stand")
    .setLabel("Stand")
    .setStyle(ButtonStyle.Danger),
} as const;
