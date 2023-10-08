import { BotCommand } from "telegraf/typings/core/types/typegram";
import { CommandData } from "../../types/commands.types";
import { Telegram } from "telegraf";
import { startCommand } from "./start-command";
import { scheduleCommand } from "./schedule-command";

class Commands {
  private botCommands: BotCommand[] = [
    { command: "start", description: "Starts the bot." },
    { command: "schedule", description: "Gets the schedule. /schedule transport_type? number?" },
  ];

  public getCommands(): BotCommand[] {
    return this.botCommands;
  }

  private executeStartCommand(commandData: CommandData, methods: Telegram): void {
    startCommand.execute(commandData, methods);
  }

  private executeScheduleCommand(commandData: CommandData, methods: Telegram): void {
    scheduleCommand.execute(commandData, methods);
  }

  public handle(commandData: CommandData, methods: Telegram): void {
    const commandName = commandData.command;
    const userId = commandData.from.id;

    const rawAdminId = process.env["ADMIN_ID"];

    if (!rawAdminId) {
      throw new Error("Enter ADMIN_ID in .env file!");
    }

    const adminId = Number(rawAdminId);

    if (userId !== adminId) {
      return;
    }

    switch (commandName) {
      case "start": {
        this.executeStartCommand(commandData, methods);
        break;
      }

      case "schedule": {
        this.executeScheduleCommand(commandData, methods);
        break;
      }
    }
  }
}

export const commands = new Commands();
