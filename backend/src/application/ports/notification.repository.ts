export interface MockEmail {
  to: string;
  subject: string;
  body: string;
  url?: string;
  sentAt: Date;
}

export interface NotificationRepository {
  send(input: { to: string; subject: string; body: string; url?: string }): Promise<void>;
  list(): Promise<MockEmail[]>;
  clear(): Promise<void>;
}
