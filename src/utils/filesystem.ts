import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

class FileSystem {
  public readonly dataDirectoryPath = "./data";

  constructor() {
    if (!existsSync(this.dataDirectoryPath)) {
      mkdirSync(this.dataDirectoryPath);
    }
  }

  public exists(path: string): boolean {
    return existsSync(path);
  }

  public mkdir(path: string): void {
    if (!this.exists(path)) {
      mkdirSync(path);
    }
  }

  public append<Data extends { toString(): string }>(path: string, data: Data): void {
    appendFileSync(path, data.toString() + "\n");
  }

  public readToString(path: string): string {
    if (this.exists(path)) {
      return readFileSync(path, { encoding: "utf-8" });
    }

    return "";
  }

  public readToJson<Data extends {}>(path: string): Data {
    try {
      const stringifiedData = this.readToString(path);
      const jsonData = JSON.parse(stringifiedData);
      return jsonData;
    }
    catch {
      return <Data>{};
    }
  }

  public write<Data extends { toString(): string }>(path: string, data: Data): void {
    writeFileSync(path, data.toString());
  }

  public writeJson<Data extends {}>(path: string, data: Data): void {
    const stringifiedData = JSON.stringify(data, null, "\t");
    this.write(path, stringifiedData);
  }
}

export const fileSystem = new FileSystem();
