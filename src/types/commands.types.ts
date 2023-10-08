export interface CommandData {
  command: string;
  args: string[];
  chat: {
    id: number;
  };
  from: {
    id: number;
  };
}

export enum ScheduleSteps {
  TYPE,
  ROUTE,
  STOPS,
  TIMETABLE
}