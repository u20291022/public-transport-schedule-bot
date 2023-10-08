export interface QueryData {
  data: string;

  message?: {
    message_id: number;
    chat: { id: number };
  };

  from: {
    id: number;
  };
}

