import httpClient from "./httpClient";

export interface MockEmail {
  to: string;
  subject: string;
  body: string;
  url?: string;
  sentAt: string;
}

export const mockMailService = {
  list: (): Promise<MockEmail[]> =>
    httpClient.get("/mock-mail").then((res) => res.data),
};
