export interface TransportData {
  transportType?: string;
  transportRoute?: string;
  transportDirection?: string;
  transportStop?: string;
}

export interface MessageData {
  chatId: number,
  messageId?: number,
  fromId: number
}

export interface ScheduleData {
  message: MessageData,
  transportData: TransportData,
  pageNumber: number
}