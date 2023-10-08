import { Telegraf, Telegram } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { CommandData } from "../types/commands.types";
import { commands } from "./commands/commands";
import { logs } from "../utils/logs";
import { QueryData } from "../types/query.types";
import { queryHandler } from "./query-handler";

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

  private listenQuery() {
    this.me.on(callbackQuery("data"), async (ctx) => {
      const queryData: QueryData = ctx.callbackQuery;
      queryHandler.handle(queryData, this.methods);
      await ctx.answerCbQuery().catch(() => {});
    })
  }

  public launch(): void {
    const botCommands = commands.getCommands();
    this.methods.setMyCommands(botCommands);

    this.listenStartCommand();
    this.listenScheduleCommand();
    this.listenQuery();

    this.me.launch();
    logs.write("Bot has started!");
  }
}
