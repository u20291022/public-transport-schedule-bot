import axios from "axios";

export class HTTPParser {
  public readonly url: string;

  constructor (url: string) {
    this.url = url;
  }

  public async getJSON<Params extends {}, Result extends {}>(params?: Params): Promise<Result> {
    const request = await axios.get(this.url, {
      headers: {
        "Content-Type": "application/json"
      },
      params
    });

    const jsonData = request.data;
    return jsonData;
  }
}