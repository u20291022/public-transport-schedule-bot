import axios from "axios";
import { JSDOM } from "jsdom";

/**
 * 0. display inline buttons with all transport types (if doesnt specified)
 * 1. get elements with city-route-item class
 * 2. get h2 text with subtitle class
 * 3. compare user transport type and h2 text
 * 4. display inline buttons with all transport numbers and save this into object (number: href) (if doesnt specified)
 * 
 * 5. get ul with route_direction class
 * 6. get stops from list items (li) (stop name is level) and save this into object (stopName: id)
 * 7. 
 */

export class Parser {
  public readonly url: string;
  private document: Document | null = null;

  constructor (url: string) {
    this.url = url;
  }

  public async get() {
    const requestInfo = await axios.get(this.url);
    const requestData = requestInfo.data;

    return requestData;
  }

  public async getDocument(): Promise<Document> {
    if (!this.document) {
      const htmlString = await this.get();
      const dom = new JSDOM(htmlString);
      const windows = dom.window;
      
      this.document = windows.document;
    }
    
    return this.document;
  }
}