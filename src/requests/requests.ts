import { TransportType } from "../types/requests.type";
import { transportNumbersRequest } from "./transport-numbers-request";

class Requests {
  public async getNumbersByTransportType(transportType: TransportType): Promise<string[]> {
    switch (transportType) {
      case TransportType.BUS: return await transportNumbersRequest.getBussesNumbers();
      case TransportType.TROLLEY: return await transportNumbersRequest.getTrolleyNumbers();
      case TransportType.TRAM: return await transportNumbersRequest.getTramNumbers();
    }
  }
}

export const requests = new Requests();