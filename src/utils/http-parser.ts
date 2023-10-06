import axios from "axios";

export class HTTPParser {
  public readonly url: string;

  constructor (url: string) {
    this.url = url;
  }

  public async getHTML(): Promise<string> {
    const request = await axios.get(this.url, {
      headers: {
        "Content-Type": "text/html"
      }
    });

    const htmlBody = request.data;
    return htmlBody;
  }

  public async getJSON<Obj extends {}>(): Promise<Obj> {
    const request = await axios.get(this.url, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    const jsonData = request.data;
    return jsonData;
  }
}


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