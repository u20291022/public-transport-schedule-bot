export enum TransportType {
  BUS = "b",
  TROLLEY = "tb",
  TRAM = "tr",
}

export type TransportRoute = string;

export interface TransportStop {
  id: string,
  name: string;
  timetable: string[];
}
