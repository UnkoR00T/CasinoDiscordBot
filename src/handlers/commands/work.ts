import type { ChatInputCommandInteraction } from "discord.js";
import { getJobByName } from "../../types/jobs_types";
import { UsersController } from "../../db/users";
import { BALANCE_DELTA } from "../../types/balance_delta";
import { EmbedsRegistry } from "../../embeds/embeds";

export const workHandler = async (interaction: ChatInputCommandInteraction) => {
  let job_type = interaction.options.getString("job_type");
  if (!job_type) return;
  let job = getJobByName(job_type);
  if (!job) return;
  let min = job.min;
  let max = job.max;
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  let transfer = UsersController.changeAmount(
    interaction.user.id,
    BALANCE_DELTA.ADD,
    random,
  );
  if (!transfer) {
    return;
  }
  interaction.reply({
    embeds: [
      EmbedsRegistry.SERVER_TRANSFER("Work", interaction.user, transfer),
    ],
    flags: "Ephemeral",
  });
};
