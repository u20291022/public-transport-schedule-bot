import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { TransportType } from "../types/requests.type";
import { InlineKeyboardData, InlineKeyboardType } from "../types/bot.types";
import { requests } from "../requests/requests";

class InlineKeyboards {
  private getTransportInlineKeyboard(): InlineKeyboardButton[][] {
    const transportInlineKeyboard: InlineKeyboardButton[][] = [
      [{ text: "Автобусы", callback_data: "Transport_" + TransportType.BUS }],
      [
        {
          text: "Троллейбусы",
          callback_data: "Transport_" + TransportType.TROLLEY,
        },
      ],
      [{ text: "Трамваи", callback_data: "Transport_" + TransportType.TRAM }],
    ];

    return transportInlineKeyboard;
  }

  // 4 x 3
  private async getNumbersInlineKeyboard(
    transportType: TransportType,
    page = 0
  ): Promise<InlineKeyboardButton[][]> {
    const numbersInlineKeyboard: InlineKeyboardButton[][] = [];
    const transportNumbers = await requests.getNumbersByTransportType(
      transportType
    );

    const offset = 12 * page;

    for (let i = offset; i < 12 + offset; i++) {
      if (transportNumbers.length < i + 1) {
        break;
      }

      const transportNumber = transportNumbers[i];
      const currentRowIndex = i === 0 ? 0 : Math.floor(i / 4);

      if (i === 0 || !numbersInlineKeyboard[currentRowIndex]) numbersInlineKeyboard.push([]);

      numbersInlineKeyboard[currentRowIndex].push({
        text: transportNumber,
        callback_data: `${transportType}_${transportNumber}`,
      });
    }

    if (offset + 12 + 1 > transportNumbers.length && page !== 0) {
      numbersInlineKeyboard.push([
        { text: "<<", callback_data: "NumbersPageBack" },
      ]);
    }

    if (transportNumbers.length > offset + 12 + 1) {
      if (page === 0) {
        numbersInlineKeyboard.push([
          { text: ">>", callback_data: "NumbersPageNext" },
        ]);
      } else {
        numbersInlineKeyboard.push([
          { text: "<<", callback_data: "NumbersPageBack" },
          { text: ">>", callback_data: "NumbersPageNext" },
        ]);
      }
    }

    return numbersInlineKeyboard;
  }

  public async get(
    keyboardType: InlineKeyboardType,
    data?: InlineKeyboardData
  ): Promise<InlineKeyboardButton[][]> {
    switch (keyboardType) {
      case InlineKeyboardType.TRANSPORT: {
        return this.getTransportInlineKeyboard();
      }

      case InlineKeyboardType.NUMBERS: {
        if (!data) return [];
        return await this.getNumbersInlineKeyboard(data.transportType);
      }

      case InlineKeyboardType.STOPS: {
        if (!data) return [];
        return [];
      }
    }
  }
}

export const inlineKeyboards = new InlineKeyboards();
