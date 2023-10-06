import { Telegram } from "telegraf";
import {
  CommandData,
  InlineKeyboardData,
  InlineKeyboardType,
} from "../types/bot.types";
import { logs } from "../utils/logs";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { TransportType } from "../types/requests.type";
import { inlineKeyboards } from "./inline-keyboards";

class ScheduleCommand {
  private getTransportTypeFromCommand(
    commandData: CommandData
  ): TransportType | null {
    const args = commandData.args;

    if (args.length === 0) {
      return null;
    }

    const transportType = args[0].toLowerCase(); // Must be first argument

    if (
      transportType.includes("автобус") ||
      transportType.includes("bus") ||
      transportType.includes("авто")
    ) {
      return TransportType.BUS;
    }

    if (
      transportType.includes("троллейбус") ||
      transportType.includes("trolley") ||
      transportType.includes("тролл")
    ) {
      return TransportType.TROLLEY;
    }

    if (
      transportType.includes("трамвай") ||
      transportType.includes("tram") ||
      transportType.includes("трам")
    ) {
      return TransportType.TRAM;
    }

    return null;
  }

  private async getScheduleText(): Promise<string> {
    const scheduleText = "";

    return scheduleText;
  }

  public async execute(
    commandData: CommandData,
    methods: Telegram
  ): Promise<void> {
    const chatId = commandData.chat.id;
    const fromId = commandData.from.id;

    let scheduleText = "Выберите тип транспорта:";
    let inlineKeyboard: InlineKeyboardButton[][] = await inlineKeyboards.get(
      InlineKeyboardType.TRANSPORT
    );
    const inlineKeyboardData: InlineKeyboardData = {
      transportType: TransportType.BUS,
      transportNumber: "23",
    };

    const transportType = this.getTransportTypeFromCommand(commandData);

    if (transportType !== null) {
      inlineKeyboardData.transportType = transportType;

      scheduleText = "Выберите номер маршрута:";
      inlineKeyboard = await inlineKeyboards.get(
        InlineKeyboardType.NUMBERS,
        inlineKeyboardData
      );

      const transportNumber = null;

      if (transportNumber !== null) {
        inlineKeyboardData.transportNumber = transportNumber;

        scheduleText = "Выберите остановку:";
        inlineKeyboard = await inlineKeyboards.get(
          InlineKeyboardType.STOPS,
          inlineKeyboardData
        );
      }
    }

    methods.sendMessage(chatId, scheduleText, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });

    logs.write(`${fromId} has got schedule!`);
  }
}

export const scheduleCommand = new ScheduleCommand();
