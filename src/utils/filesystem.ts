import { appendFileSync, existsSync, mkdirSync } from "fs";

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
}

export const fileSystem = new FileSystem();
