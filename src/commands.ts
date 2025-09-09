import { SlashCommandBuilder } from "discord.js";
import { JOB_TYPES } from "./types/jobs_types";
import { DICE_TYPES } from "./types/dice_types";
import { ITEMS } from "./types/inventory";

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
    .addStringOption((option) => {
      option
        .setName("job_type")
        .setDescription("Choses type of job.")
        .setRequired(true);
      Object.values(JOB_TYPES).map((j) =>
        option.addChoices({ name: j.displayname, value: j.name }),
      );
      return option;
    }),
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
  new SlashCommandBuilder()
    .setName("slot")
    .setDescription("Just a slot")
    .addNumberOption((option) =>
      option.setName("amount").setDescription("Bet amount").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Command for buying/selling items")
    .addStringOption((option) => {
      option
        .setName("item_name")
        .setDescription("Item's name")
        .setRequired(false);
      Object.values(ITEMS).map((item) => {
        option.addChoices({
          name: item.displayname,
          value: item.name,
        });
      });
      return option;
    })
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of item to buy/sell")
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Buy/Sell")
        .setRequired(false)
        .addChoices(
          {
            name: "Buy",
            value: "buy",
          },
          {
            name: "Sell",
            value: "sell",
          },
        ),
    ),
  new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Inventory")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Selects target")
        .setRequired(false),
    ),
];
