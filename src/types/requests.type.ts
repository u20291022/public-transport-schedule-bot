export interface AllTransportNumbers {
  busses: string[];
  trolley: string[];
  tram: string[];
}

export enum TransportType {
  BUS = "b",
  TROLLEY = "tb",
  TRAM = "tr",
}

export interface TransportRoute {
  time: string;
  states: {
    route: string;
    vt: string;
  }[];
}
