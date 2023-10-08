export interface KeyboardWithPagesData {
  rowsCount: number;
  columnsCount: number;
  page: number;
}

export enum PageDirection {
  BACK = "back",
  FORWARD = "forward"
}

export interface Callback {
  text: string,
  data: string
}