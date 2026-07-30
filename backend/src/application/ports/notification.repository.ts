export interface NotificationRepository {
  send(input: { to: string; subject: string; body: string; url?: string }): Promise<void>;
}
