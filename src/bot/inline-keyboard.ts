import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { TransportRoute, TransportType } from "../types/transport.types";
import { TransportData } from "../types/schedule.types";
import { requests } from "../requests/requests";
import { Callback, KeyboardWithPagesData, PageDirection } from "../types/inline-keyboard.types";

class InlineKeyboards {
  private getKeyboardWithPagesFromArray(
    // i must refactor this
    callbacks: Callback[],
    keyboardData: KeyboardWithPagesData,
    prevData: string
  ): InlineKeyboardButton[][] {
    const { rowsCount, columnsCount, page } = keyboardData;
    const inlineKeyboard: InlineKeyboardButton[][] = [];

    const offset = page * (rowsCount * columnsCount);

    for (let callbackIndex = offset; callbackIndex < callbacks.length; callbackIndex++) {
      if (callbackIndex >= offset + rowsCount * columnsCount) {
        break;
      }

      const callback = callbacks[callbackIndex];
      const rowId = Math.floor((callbackIndex - offset) / columnsCount);

      if (!inlineKeyboard[rowId]) inlineKeyboard.push([]);

      inlineKeyboard[rowId].push({
        text: callback.text,
        callback_data: callback.data,
      });
    }

    inlineKeyboard.push([]); // for page buttons

    if (page !== 0) {
      inlineKeyboard[inlineKeyboard.length - 1].push({
        text: "<<",
        callback_data: `${prevData}~${PageDirection.BACK}|${page}`,
      });
    }

    if (offset + rowsCount * columnsCount < callbacks.length) {
      inlineKeyboard[inlineKeyboard.length - 1].push({
        text: ">>",
        callback_data: `${prevData}~${PageDirection.FORWARD}|${page}`,
      });
    }
    
    return inlineKeyboard;
  }

  private getTypesKeyboard(): InlineKeyboardButton[][] {
    const callbacks: Callback[] = [
      { text: "🚌 Автобус", data: TransportType.BUS },
      { text: "🚎 Троллейбус", data: TransportType.TROLLEY },
      { text: "🚋 Трамвай", data: TransportType.TRAM },
    ];

    const keyboardData: KeyboardWithPagesData = {
      rowsCount: 3,
      columnsCount: 1,
      page: 0,
    };

    return this.getKeyboardWithPagesFromArray(callbacks, keyboardData, "");
  }

  private async getRoutesKeyboard(transportType: TransportType, page: number): Promise<InlineKeyboardButton[][]> {
    const routes = await requests.getRoutesByTransportType(transportType);
    const callbacks: Callback[] = routes.map((route) => {
      return { text: route, data: `${transportType}|${route}` };
    });

    const keyboardData: KeyboardWithPagesData = {
      rowsCount: 3,
      columnsCount: 4,
      page,
    };

    return this.getKeyboardWithPagesFromArray(callbacks, keyboardData, transportType);
  }

  private async getStopsKeyboard(
    transportType: TransportType,
    transportRoute: TransportRoute,
    page: number
  ): Promise<InlineKeyboardButton[][]> {
    const stops = await requests.getStopsByTransportRoute(transportRoute);
    const callbacks: Callback[] = stops.map((stop) => {
      return { text: stop.name, data: `${transportType}|${transportRoute}|${stop.id}` };
    });
    
    const keyboardData: KeyboardWithPagesData = {
      rowsCount: 4,
      columnsCount: 1,
      page,
    };
    
    return this.getKeyboardWithPagesFromArray(callbacks, keyboardData, `${transportType}|${transportRoute}`);
  }

  public async getKeyboardByTransportData(
    transportData: TransportData,
    page: number
  ): Promise<InlineKeyboardButton[][]> {
    const { transportType, transportRoute, transportStop } = transportData;
    
    if (!transportType) {
      return this.getTypesKeyboard();
    }

    if (!transportRoute) {
      return this.getRoutesKeyboard(transportType as TransportType, page);
    }

    if (!transportStop) {
      return this.getStopsKeyboard(transportType as TransportType, transportRoute, page);
    }

    return [];
  }
}

export const inlineKeyboards = new InlineKeyboards();
