import {
  AllTransportNumbers,
  TransportRoute,
  TransportType,
} from "../types/requests.type";
import { HTTPParser } from "../utils/http-parser";
import { time } from "../utils/time";

class TransportNumbersRequest {
  private allTransportNumbers: AllTransportNumbers | null = null;
  private currentHour = time.getCurrentHour();
  public mainUrl = "https://go2bus.ru/inforoutestates?srv=kem&vt=";

  public async getBussesNumbers() {
    const bussesNumbers = (await this.getAllTransportNumbers()).busses;
    return bussesNumbers;
  }

  public async getTrolleyNumbers() {
    const trolleysNumbers = (await this.getAllTransportNumbers()).trolley;
    return trolleysNumbers;
  }

  public async getTramNumbers() {
    const tramsNumbers = (await this.getAllTransportNumbers()).tram;
    return tramsNumbers;
  }

  private async getAllTransportNumbers(): Promise<AllTransportNumbers> {
    if (this.allTransportNumbers && this.currentHour === time.getCurrentHour()) {
      return this.allTransportNumbers;
    }

    let bussesNumbers: string[] = [];
    let trolleysNumbers: string[] = [];
    let tramsNumbers: string[] = [];

    const transportTypes = Object.values(TransportType);

    for (let transportType of transportTypes) {
      const currentTransportRoutesUrl = this.mainUrl + transportType;

      const httpParser = new HTTPParser(currentTransportRoutesUrl);
      const transportRoute: TransportRoute = await httpParser.getJSON();
      
      const transportStates = transportRoute.states;

      for (
        let stateIndex = 0;
        stateIndex < transportStates.length;
        stateIndex++
      ) {
        const transportState = transportStates[stateIndex];
        const transportStateNumber = transportState.route;
        
        if (
          bussesNumbers.includes(transportStateNumber) ||
          trolleysNumbers.includes(transportStateNumber) ||
          tramsNumbers.includes(transportStateNumber)
        ) {
          continue;
        }

        switch (transportType) {
          case TransportType.BUS: {
            bussesNumbers.push(transportStateNumber);
            break;
          }

          case TransportType.TROLLEY: {
            trolleysNumbers.push(transportStateNumber);
            break;
          }

          case TransportType.TRAM: {
            tramsNumbers.push(transportStateNumber);
            break;
          }
        }
      }
    }

    bussesNumbers = this.sortTransportNumbers(bussesNumbers);
    trolleysNumbers = this.sortTransportNumbers(trolleysNumbers);
    tramsNumbers = this.sortTransportNumbers(tramsNumbers);

    const allTransportNumbers: AllTransportNumbers = {
      busses: bussesNumbers,
      trolley: trolleysNumbers,
      tram: tramsNumbers,
    };

    this.allTransportNumbers = allTransportNumbers;
    this.currentHour = time.getCurrentHour();

    return allTransportNumbers;
  }

  private sortTransportNumbers(transportNumbers: string[]): string[] {
    return transportNumbers.sort((a, b) => {
      a = a.replace(/\D/g, "");
      b = b.replace(/\D/g, "");

      return Number(a) - Number(b);
    })
  }
}

export const transportNumbersRequest = new TransportNumbersRequest();
