import { TransportType } from "./requests.type";

export interface CommandData {
  command: string;
  args: string[];
  chat: {
    id: number;
  };
  from: {
    id: number;
  };
}

export enum InlineKeyboardType {
  TRANSPORT,
  NUMBERS,
  STOPS
}

export interface InlineKeyboardData {
  transportType: TransportType;
  transportNumber: string;
}