import { JSDOM } from "jsdom";

class HTMLParser {
  public parseFromString(htmlString: string): Document {
    const DOM = new JSDOM(htmlString);
    const window = DOM.window;
    const document = window.document;

    return document;
  }
}

export const htmlParser = new HTMLParser();