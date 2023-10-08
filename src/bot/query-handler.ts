import { Telegram } from "telegraf";
import { QueryData } from "../types/query.types";
import { MessageData, ScheduleData, TransportData } from "../types/schedule.types";
import { scheduleHandler } from "./schedule-handler";
import { PageDirection } from "../types/inline-keyboard.types";

class QueryHandler {
  public handle(queryData: QueryData, methods: Telegram): void {
    const { data, message, from } = queryData;

    if (!message) return;

    const messageData: MessageData = {
      chatId: message.chat.id,
      messageId: message.message_id,
      fromId: from.id,
    };


    const [transportQueryData, pageQueryData] = data.split("~"); // type|route|stop || ...~pageDirection|pageNumber
    
    let [transportType, transportRoute, transportStop] = transportQueryData.split("|");
    let [pageDirection, pageNumberString] = pageQueryData ? pageQueryData.split("|") : [];
    
    let pageNumber = 0;
    let transportData = {
      transportType,
      transportRoute,
      transportStop,
    };

    if (pageDirection && pageNumberString) {
      pageNumber = Number(pageNumberString);

      switch (pageDirection) {
        case PageDirection.BACK: {
          pageNumber--;
          break;
        }

        case PageDirection.FORWARD: {
          pageNumber++;
          break;
        }
      }
    }

    const scheduleData: ScheduleData = {
      message: messageData,
      transportData,
      pageNumber,
    };

    scheduleHandler.handle(methods, scheduleData);
  }
}

export const queryHandler = new QueryHandler();
