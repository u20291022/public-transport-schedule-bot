import { Transport } from "../types/requests.type";
import { Parser } from "../utils/parser";

class Requests {
  private readonly mainUrl = "https://goonbus.ru/kemerovo";

  private async getUrlDocument(url: string): Promise<Document> {
    const parser = new Parser(url);
    const document = await parser.getDocument();
    
    return document;
  }

  public async getAllTransportByType(transportType: string): Promise<Transport[]> {
    const busses: Transport[] = [];
    
    const mainDocument = await this.getUrlDocument(this.mainUrl);
    const mainTab = mainDocument.getElementById("tabs-1");
    
    if (!mainTab) {
      return [];
    }

    const cityRouteItems = mainTab.getElementsByClassName("city-route-item");
    
    for (let cityRouteItemIndex = 0; cityRouteItemIndex < cityRouteItems.length; cityRouteItemIndex++) {
      const cityRouteItem = cityRouteItems.item(cityRouteItemIndex);
      
      if (!cityRouteItem) {
        continue;
      }
      
      const subtitle = cityRouteItem.getElementsByClassName("subtitle")[0];
      const tx = subtitle.getElementsByClassName("tx")[0];
      const headerText = tx.textContent;

      if (!headerText?.includes(transportType.slice(0, 5))) { // трамваев - трамв
        continue;
      }

      const unorderedList = cityRouteItem.getElementsByTagName("ul")[0];
      const listItems = unorderedList.getElementsByTagName("li");

      for (let listItemIndex = 0; listItemIndex < listItems.length; listItemIndex++) {
        const listItem = listItems.item(listItemIndex);
        
        if (!listItem) {
          continue;
        }

        const link = listItem.getElementsByTagName("a")[0];
      
        if (!link) {
          continue;
        }

        const href = link.href;
        const levelSpan = link.getElementsByClassName("level")[0];
        const busNumber = levelSpan.textContent;

        if (!busNumber || !href) {
          continue;
        }

        const currentBus: Transport = {
          number: busNumber,
          href: href
        }

        busses.push(currentBus);
      }
    }

    return busses;
  }

}

export const requests = new Requests();