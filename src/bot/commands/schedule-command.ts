import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands.types";
import { logs } from "../../utils/logs";
import { TransportRoute, TransportType } from "../../types/transport.types";
import { MessageData, ScheduleData, TransportData } from "../../types/schedule.types";
import { scheduleHandler } from "../schedule-handler";

class ScheduleCommand {
  private parseTransportTypeFromArgs(commandArgs: string[]): string | undefined {
    if (commandArgs.length < 1) return undefined;

    const transportType = commandArgs[0];

    if (transportType.includes("авто") || transportType.includes("bus")) {
      return TransportType.BUS;
    }

    if (transportType.includes("тролл") || transportType.includes("trolley")) {
      return TransportType.TROLLEY;
    }

    if (transportType.includes("трам") || transportType.includes("tram")) {
      return TransportType.TRAM;
    }

    return undefined;
  }

  private parseTransportRouteFromArgs(commandArgs: string[]): string | undefined {
    if (commandArgs.length < 2) return undefined;

    const transportType = this.parseTransportTypeFromArgs(commandArgs);
    const transportRoute =
      (transportType === TransportType.BUS ? "" : transportType === TransportType.TROLLEY ? "0" : "00") +
      commandArgs[1];

    return transportRoute;
  }

  public async execute(commandData: CommandData, methods: Telegram) {
    const { args, chat, from } = commandData;

    const messageData: MessageData = {
      chatId: chat.id,
      fromId: from.id,
    };

    const transportType: string | undefined = this.parseTransportTypeFromArgs(args);
    const transportRoute: string | undefined = this.parseTransportRouteFromArgs(args);

    const transportData: TransportData = { transportType, transportRoute };

    const scheduleData: ScheduleData = {
      message: messageData,
      transportData,
      pageNumber: 0,
    };

    scheduleHandler.handle(methods, scheduleData);

    logs.write(`${from.id} has requested schedule! ${args.length > 0 ? `args: ${JSON.stringify(args)}` : ""}`);
  }
}

export const scheduleCommand = new ScheduleCommand();
