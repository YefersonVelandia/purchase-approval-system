import { NotificationRepository } from "../../application/ports/notification.repository";

export class MockEmailRepository implements NotificationRepository {
  async send(input: { to: string; subject: string; body: string }): Promise<void> {
    console.log("MOCK EMAIL");
    console.log("----------------");
    console.log("TO:", input.to);
    console.log("SUBJECT:", input.subject);
    console.log(input.body);
    console.log("----------------");
  }
}
