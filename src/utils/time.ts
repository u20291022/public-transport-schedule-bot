class Time {
  public getCurrentDateString(): string {
    const date = new Date();
    const dateString = date.toLocaleDateString("ru-RU")

    return dateString;
  }

  public getCurrentTimeString(): string {
    const date = new Date();
    const rawTimeString = date.toLocaleTimeString();
    const timeString = rawTimeString.replace(/\./g, ":");

    return timeString;
  }

  public getCurrentHour(): number {
    const date = new Date();
    const currentHour = date.getHours();

    return currentHour;
  }
}

export const time = new Time();