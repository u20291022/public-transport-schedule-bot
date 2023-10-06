import { Telegraf, Telegram } from "telegraf";
import { CommandData } from "../types/bot.types";
import { commands } from "./commands";
import { logs } from "../utils/logs";

export class Bot {
  public readonly me: Telegraf;
  public readonly methods: Telegram;

  constructor(token: string) {
    this.me = new Telegraf(token);
    this.methods = this.me.telegram;
  }

  private listenStartCommand() {
    this.me.command("start", (ctx) => {
      const commandData: CommandData = ctx;
      commands.handle(commandData, this.methods);
    });
  }

  private listenScheduleCommand() {
    this.me.command("schedule", (ctx) => {
      const commandData: CommandData = ctx;
      commands.handle(commandData, this.methods);
    });
  }

  public launch(): void {
    const botCommands = commands.getCommands();
    this.methods.setMyCommands(botCommands);

    this.listenStartCommand();
    this.listenScheduleCommand();

    this.me.launch();
    logs.write("Bot has started!")
  }
}
