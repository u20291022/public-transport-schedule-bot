import { Telegram } from "telegraf";
import { CommandData } from "../types/bot.types";
import { logs } from "../utils/logs";
import { requests } from "../requests/requests";

class ScheduleCommand {
  private async getScheduleText(): Promise<string> {
    const scheduleText = "Расписание:\n";
    const allBusses = await requests.getAllTransportByType("автобус");
    const allTrals = await requests.getAllTransportByType("троллейбус");
    const allTrams = await requests.getAllTransportByType("трамвай");
    

    return scheduleText;
  }

  public async execute(commandData: CommandData, methods: Telegram): Promise<void> {
    const chatId = commandData.chat.id;
    const fromId = commandData.from.id;
    const scheduleText = await this.getScheduleText();

    methods.sendMessage(chatId, scheduleText);

    logs.write(`${fromId} has got schedule!`);
  }
}

export const scheduleCommand = new ScheduleCommand();
