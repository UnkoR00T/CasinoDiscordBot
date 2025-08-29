import { SlashCommandBuilder } from "discord.js";
import { JOB_TYPES } from "./types/jobs_types";
import { DICE_TYPES } from "./types/dice_types";

export const commands = [
  new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Returns balance of a user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Selects player")
        .setRequired(false),
    ),
  new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Transfers money to another user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Selects player")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option.setName("amount").setDescription("Sets amount").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("work")
    .setDescription("Way of getting money")
    .addStringOption((option) =>
      option
        .setName("job_type")
        .setDescription("Choses type of job.")
        .addChoices(
          {
            name: JOB_TYPES.MCDONALDS.displayname,
            value: JOB_TYPES.MCDONALDS.name,
          },
          {
            name: JOB_TYPES.DOG_SITTER.displayname,
            value: JOB_TYPES.DOG_SITTER.name,
          },
          { name: JOB_TYPES.MAID.displayname, value: JOB_TYPES.MAID.name },
          { name: JOB_TYPES.THIEF.displayname, value: JOB_TYPES.THIEF.name },
        )
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Try your luck in dice roll")
    .addStringOption((option) => {
      option
        .setName("roll_type")
        .setDescription("Selects type of dice roll")
        .setRequired(true);
      Object.values(DICE_TYPES).map((e) =>
        option.addChoices({
          name: e.displayname,
          value: e.name,
        }),
      );
      return option;
    })
    .addNumberOption((option) =>
      option.setName("amount").setDescription("Bet amount").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("steal")
    .setDescription("Steal money from other user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Who to steal from")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("blackjack")
    .setDescription("Blackjack")
    .addNumberOption((option) =>
      option.setName("amount").setDescription("Bet amount").setRequired(true),
    ),
];
