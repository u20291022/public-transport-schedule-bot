import { AllTransportRoutes, TransportStatesResponse } from "../types/requests.type";
import { TransportType } from "../types/transport.types";
import { HTTPParser } from "../utils/http-parser";
import { time } from "../utils/time";

class TransportRoutes {
  private readonly routesUrl = "https://go2bus.ru/inforoutestates?srv=kem&vt=";
  private routes: AllTransportRoutes = { busses: [], trolleys: [], trams: [] };
  private currentMinute = time.getCurrentMinute();

  public async getAllRoutes(): Promise<AllTransportRoutes> {
    if (this.routes.busses.length > 0 && time.getCurrentMinute() - this.currentMinute < 5) {
      return this.routes; // if we parsed routes and last parse time >= 5 minutes
    }

    const transportTypes = Object.values(TransportType);

    for (let transportType of transportTypes) {
      const transportRoutesUrl = this.routesUrl + transportType; // https://.../...&vt=transport_type
      const httpParser = new HTTPParser(transportRoutesUrl);
     
      const transportStatesResponse: TransportStatesResponse = await httpParser.getJSON();
      const transportStates = transportStatesResponse.states;
      
      const sortedTransportStates = transportStates.sort((a, b) => {
        const [aRouteNumber, bRouteNumber] = [a.route, b.route].map((route) => {
          return Number(route.replace(/\D/g, ""));
        });

        return aRouteNumber - bRouteNumber;
      });

      const pushedTransportRoutes: string[] = [];

      for (let transportState of sortedTransportStates) {
        const transportRoute = transportState.route;

        if (pushedTransportRoutes.includes(transportRoute)) {
          continue; // remove duplicates
        }
        
        switch (transportType) {
          case TransportType.BUS: {
            this.routes.busses.push(transportRoute);
            break;
          }

          case TransportType.TROLLEY: {
            this.routes.trolleys.push(transportRoute);
            break;
          }

          case TransportType.TRAM: {
            this.routes.trams.push(transportRoute);
            break;
          }
        }

        pushedTransportRoutes.push(transportRoute);
      }
    }

    return this.routes;
  }
}

export const transportRoutes = new TransportRoutes();
