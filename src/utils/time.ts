class Time {
  public getCurrentDateString(): string {
    const date = new Date();
    const rawDateString = date.toLocaleDateString("ru-RU");
    const dateString = rawDateString.replace(/\./g, "-");

    return dateString;
  }

  public getCurrentTimeString(): string {
    const date = new Date();
    const rawTimeString = date.toLocaleTimeString();
    const timeString = rawTimeString.replace(/\./g, ":");

    return timeString;
  }

  public getCurrentMinute(): number {
    const date = new Date();
    const currentMinute = date.getMinutes();

    return currentMinute;
  }
}

export const time = new Time();