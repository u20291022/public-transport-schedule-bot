import { Telegram } from "telegraf";
import { TransportRoute, TransportStop, TransportType } from "../types/transport.types";
import { MessageData, ScheduleData, TransportData } from "../types/schedule.types";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { inlineKeyboards } from "./inline-keyboard";

class ScheduleHandler {
  public async handle(methods: Telegram, scheduleData: ScheduleData): Promise<void> {
    const { messageId, chatId, fromId } = scheduleData.message;
    const transportData = scheduleData.transportData;
    const pageNumber = scheduleData.pageNumber;

    if (!messageId) {
      // from command
      const transportTypesText = "Выберите тип транспорта:";
      const transportTypesKeyboard = await inlineKeyboards.getKeyboardByTransportData(transportData, pageNumber);

      await methods
        .sendMessage(chatId, transportTypesText, {
          reply_markup: {
            inline_keyboard: transportTypesKeyboard,
          },
        })
        .catch(() => {});
    }

    if (messageId && chatId) {
      // from query
      // edit message and keyboard by current step
      const newMessageText = "123";
      const newMessageKeyboard: InlineKeyboardButton[][] = await inlineKeyboards.getKeyboardByTransportData(
        transportData,
        pageNumber
      );

      // await methods.editMessageCaption(chatId, messageId, undefined, newMessageText).catch(() => {});
      await methods
        .editMessageReplyMarkup(chatId, messageId, undefined, {
          inline_keyboard: newMessageKeyboard,
        })
        .catch(() => {});
    }
  }
}

export const scheduleHandler = new ScheduleHandler();
