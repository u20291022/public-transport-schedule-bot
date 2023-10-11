import { Telegram } from "telegraf";
import { ScheduleData } from "../types/schedule.types";
import { inlineKeyboards } from "./inline-keyboard";
import { scheduleText } from "./schedule-text";

class ScheduleHandler {
  public async handle(methods: Telegram, scheduleData: ScheduleData): Promise<void> {
    const { messageId, chatId, fromId } = scheduleData.message;
    const transportData = scheduleData.transportData;
    const pageNumber = scheduleData.pageNumber;

    const messageText = await scheduleText.getTextByTransportData(transportData);
    const messageKeyboard = await inlineKeyboards.getKeyboardByTransportData(transportData, pageNumber);

    if (!messageId) { // from command
      await methods
        .sendMessage(chatId, messageText, {
          reply_markup: {
            inline_keyboard: messageKeyboard,
          },
        })
        .catch(() => {});
    }

    if (messageId && chatId) { // from query
      await methods.editMessageText(chatId, messageId, undefined, messageText).catch(() => {});
      await methods
        .editMessageReplyMarkup(chatId, messageId, undefined, {
          inline_keyboard: messageKeyboard,
        })
        .catch(() => {});
    }
  }
}

export const scheduleHandler = new ScheduleHandler();
