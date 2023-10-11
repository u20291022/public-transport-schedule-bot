import { TransportDirection, TransportRoute, TransportStop, TransportType } from "../types/transport.types";
import { transportRoutes } from "./transport-routes";
import { transportStops } from "./transport-stops";

class Requests {
  public async getRoutesByTransportType(transportType: TransportType) {
    const routes = await transportRoutes.getAllRoutes().catch(() => {
      return { busses: [], trolleys: [], trams: [] };
    });

    switch (transportType) {
      case TransportType.BUS:
        return routes.busses;
      case TransportType.TROLLEY:
        return routes.trolleys;
      case TransportType.TRAM:
        return routes.trams;
    }
  }

  public async getStopsByTransportRoute(transportRoute: TransportRoute, transportDirection: TransportDirection): Promise<TransportStop[]> {
    const stops = await transportStops.getStops(transportRoute, transportDirection).catch(() => {
      return [];
    });
    return stops;
  }
}

export const requests = new Requests();
