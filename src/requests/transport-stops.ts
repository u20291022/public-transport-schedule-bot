import { TransportStopsParams, TransportStopsResponse } from "../types/requests.type";
import { TransportRoute, TransportStop } from "../types/transport.types";
import { HTTPParser } from "../utils/http-parser";

class TransportStops {
  private readonly stopsUrl = "https://go2bus.ru/inforoutedetails";

  public async getStops(transportRoute: TransportRoute): Promise<TransportStop[]> {
    const transportStops: TransportStop[] = [];

    const httpParser = new HTTPParser(this.stopsUrl);
    const stopsParams: TransportStopsParams = { route: transportRoute, srv: "kem" };
    const routeStopsResponse: TransportStopsResponse = await httpParser.getJSON(stopsParams);
    const directions = routeStopsResponse.directions[0]; // 0 start to end - 1 end to start
    const stops = directions.stops;

    for (let stop of stops) {
      const stopId = stop.zones[0].id;
      const stopName = stop.zones[0].name;
      const stopTimetable = stop.comings.map(v => v.time.split("T")[1]); // 2023-10-08T19:16:00 - T is split symbol

      const transportStop: TransportStop = {
        id: stopId,
        name: stopName,
        timetable: stopTimetable,
      };

      transportStops.push(transportStop);
    }

    return transportStops;
  }
}

export const transportStops = new TransportStops();
