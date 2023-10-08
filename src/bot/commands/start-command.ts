import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands.types";
import { logs } from "../../utils/logs";

class StartCommand {
  private getStartText(): string {
    const startText =
      "Привет!\n" +
      "Чтобы получить расписание маршрутов для автобусов, троллейбусов и трамваев в городе Кемерово\n" +
      "Отправь команду: /schedule транспорт? номер?" +
      "Пример использования: /schedule автобус 23";

    return startText;
  }

  public execute(commandData: CommandData, methods: Telegram): void {
    const chatId = commandData.chat.id;
    const fromId = commandData.from.id;
    const startText = this.getStartText();

    methods.sendMessage(chatId, startText);

    logs.write(`${fromId} has started the bot!`);
  }
}

export const startCommand = new StartCommand();
