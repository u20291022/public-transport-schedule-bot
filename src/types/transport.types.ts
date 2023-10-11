export enum TransportType {
  BUS = "b",
  TROLLEY = "tb",
  TRAM = "tr",
}

export type TransportRoute = string;
export enum TransportDirection {
  START2END = "s2e",
  END2START = "e2s",
}

export interface TransportStop {
  id: string,
  name: string;
  timetable: string[];
}
