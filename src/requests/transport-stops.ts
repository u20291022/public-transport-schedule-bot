import { RoutesAndStops, TransportStopsParams, TransportStopsResponse } from "../types/requests.type";
import { TransportDirection, TransportRoute, TransportStop } from "../types/transport.types";
import { fileSystem } from "../utils/filesystem";
import { HTTPParser } from "../utils/http-parser";
import { time } from "../utils/time";

class TransportStops {
  private readonly stopsDataPath = fileSystem.dataDirectoryPath + "/stops.json";
  private readonly stopsUrl = "https://go2bus.ru/inforoutedetails";
  private routesAndStops: RoutesAndStops = {};
  private currentMinute = time.getCurrentMinute();

  constructor() {
    if (fileSystem.exists(this.stopsDataPath)) {
      this.routesAndStops = fileSystem.readToJson(this.stopsDataPath);
    }
  }

  private updateStopsData() {
    fileSystem.writeJson(this.stopsDataPath, this.routesAndStops);
  }

  public async getStops(
    transportRoute: TransportRoute,
    transportDirection: TransportDirection
  ): Promise<TransportStop[]> {
    const direction = transportDirection === TransportDirection.START2END ? 0 : 1;

    if (
      this.routesAndStops[transportRoute] &&
      this.routesAndStops[transportRoute][direction] &&
      time.getCurrentMinute() - this.currentMinute <= 15
    ) {
      return this.routesAndStops[transportRoute][direction];
    }

    const transportStops: TransportStop[] = [];

    const httpParser = new HTTPParser(this.stopsUrl);
    const stopsParams: TransportStopsParams = { route: transportRoute, srv: "kem" };
    const routeStopsResponse: TransportStopsResponse = await httpParser.getJSON(stopsParams);
    const directions = routeStopsResponse.directions[direction]; // 0 start to end - 1 end to start
    const stops = directions.stops;

    for (let stop of stops) {
      const stopId = stop.zones[0].id;
      const stopName = stop.zones[0].name;
      const stopTimetable = stop.comings.map((v) => v.time.split("T")[1]); // 2023-10-08T19:16:00 - T is split symbol

      const transportStop: TransportStop = {
        id: stopId,
        name: stopName,
        timetable: stopTimetable,
      };

      transportStops.push(transportStop);
    }

    if (!this.routesAndStops[transportRoute]) this.routesAndStops[transportRoute] = {};

    this.routesAndStops[transportRoute][direction] = transportStops;
    this.currentMinute = time.getCurrentMinute();
    this.updateStopsData();

    return transportStops;
  }
}

export const transportStops = new TransportStops();
