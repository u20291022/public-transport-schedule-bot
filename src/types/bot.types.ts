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
