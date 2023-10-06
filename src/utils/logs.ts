import { fileSystem } from "./filesystem";
import { time } from "./time";

class Logs {
  public readonly logsDirectoryPath = fileSystem.dataDirectoryPath + "/logs";

  constructor () {
    fileSystem.mkdir(this.logsDirectoryPath);
  }

  public write<Data extends { toString(): string }>(data: Data, silent = false): void {
    const currentDateString = time.getCurrentDateString();
    const currentTimeString = time.getCurrentTimeString();

    const logFilePath = `${this.logsDirectoryPath}/${currentDateString}.txt`;
    const logMessage = `[${currentTimeString}] ${data.toString()}`;

    fileSystem.append(logFilePath, logMessage);

    if (!silent) {
      console.log(logMessage);
    }
  }
}

export const logs = new Logs();