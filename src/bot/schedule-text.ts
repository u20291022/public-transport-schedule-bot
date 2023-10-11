import { requests } from "../requests/requests";
import { TransportData } from "../types/schedule.types";
import { TransportDirection, TransportType } from "../types/transport.types";

class ScheduleText {
  private getTypesText(): string {
    return "Выберите тип транспорта:";
  }

  private getRoutesText(): string {
    return "Выберите номер маршрута:";
  }

  private getDirectionsText(): string {
    return "Выберите направление движения:";
  }

  private getStopsText(): string {
    return "Выберите остановку:";
  }

  private async getTimetable(transportData: TransportData): Promise<string> {
    const { transportType, transportRoute, transportDirection, transportStop } = transportData;

    if (!transportType || !transportRoute || !transportDirection || !transportStop) {
      return "Возникла ошибка.";
    }

    const routeStops = await requests.getStopsByTransportRoute(
      transportRoute,
      transportDirection as TransportDirection
    );

    const stopsTimetable = routeStops.filter((stop) => {
      if (stop.id === transportStop) {
        return stop;
      }
    })[0];

    if (!stopsTimetable) return "Возникла ошибка.";

    let transportTypeText = "";
    let transportRouteText = "";
    const transportDirectionText =
      transportDirection === TransportDirection.START2END ? "Начальная-конечная" : "Конечная-начальная";

    let timetableHour = "";
    const transportCurrentStop = stopsTimetable;
    const trasnportTimetable = transportCurrentStop.timetable
      .map((time) => {
        time = time.slice(0, -3);

        if (timetableHour !== time.slice(0, 2)) {
          timetableHour = time.slice(0, 2);
          time = "\n" + time;
        }

        return time;
      })
      .join(" ");

    switch (transportType) {
      case TransportType.BUS: {
        transportTypeText = "автобуса";
        transportRouteText = transportRoute;
        break;
      }

      case TransportType.TROLLEY: {
        transportTypeText = "троллейбуса";
        transportRouteText = transportRoute.slice(1);
        break;
      }

      case TransportType.TRAM: {
        transportTypeText = "трамвая";
        transportRouteText = transportRoute.slice(2);
        break;
      }
    }

    return (
      `📆 Расписание для ${transportTypeText} №${transportRouteText}` +
      ` и остановки "${transportCurrentStop.name}" по направлению "${transportDirectionText}":\n${trasnportTimetable}`
    );
  }

  public async getTextByTransportData(transportData: TransportData): Promise<string> {
    const { transportType, transportRoute, transportDirection, transportStop } = transportData;

    if (!transportType) {
      return this.getTypesText();
    }

    if (!transportRoute) {
      return this.getRoutesText();
    }

    if (!transportDirection) {
      return this.getDirectionsText();
    }

    if (!transportStop) {
      return this.getStopsText();
    }

    if (transportType && transportRoute && transportDirection && transportStop) {
      return await this.getTimetable(transportData);
    }

    return "Возникла ошибка.";
  }
}

export const scheduleText = new ScheduleText();
