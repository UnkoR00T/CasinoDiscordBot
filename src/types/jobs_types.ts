import type { APIApplicationCommandOptionChoice } from "discord.js";

export const JOB_TYPES = {
  MCDONALDS: {
    name: "mcdonalds",
    displayname: "McDonalds",
    min: 1500,
    max: 12500,
  },
  DOG_SITTER: {
    name: "dog_sitter",
    displayname: "Dog Sitter",
    min: 500,
    max: 5000,
  },
  MAID: {
    name: "maid",
    displayname: "Maid",
    min: 1000,
    max: 7500,
  },
  THIEF: { name: "thief", displayname: "Thief", min: -12500, max: 25000 },
  WHORE: {
    name: "whore",
    displayname: "Whore",
    min: 5000,
    max: 22500,
  },
  PIMP: {
    name: "pimp",
    displayname: "Pimp",
    min: 7500,
    max: 30000,
  },
} satisfies Record<
  string,
  { name: string; displayname: string; min: number; max: number }
>;

export type JobKey = keyof typeof JOB_TYPES;
export type JobDef = (typeof JOB_TYPES)[JobKey];
export function getJobByName(name: string): JobDef | undefined {
  return Object.values(JOB_TYPES).find((job) => job.name === name);
}
