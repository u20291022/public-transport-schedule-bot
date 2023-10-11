import { TransportRoute, TransportStop } from "./transport.types";

export interface TransportStatesResponse {
  time: string;
  states: {
    route: string;
  }[];
}

export interface AllTransportRoutes {
  busses: TransportRoute[];
  trolleys: TransportRoute[];
  trams: TransportRoute[];
}

export interface TransportStopsParams {
  route: string;
  srv: "kem";
}

export interface TransportStopsResponse {
  directions: {
    stops: {
      zones: {
        id: string;
        name: string;
      }[];

      comings: {
        time: string;
      }[];
    }[];
  }[];
}

interface Directions {
  [direction: string]: TransportStop[];
}

export interface RoutesAndStops {
  [route: string]: Directions;
}
