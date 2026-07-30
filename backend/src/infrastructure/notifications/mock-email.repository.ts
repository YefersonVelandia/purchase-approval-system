import { NotificationRepository } from "../../application/ports/notification.repository";

export interface MockEmail {
  to: string;
  subject: string;
  body: string;
  url?: string;
  sentAt: Date;
}

export class MockEmailRepository implements NotificationRepository {
  private static emails: MockEmail[] = [];

  async send(input: { to: string; subject: string; body: string; url?: string }): Promise<void> {
    const email: MockEmail = {
      to: input.to,
      subject: input.subject,
      body: input.body,
      url: input.url,
      sentAt: new Date(),
    };

    MockEmailRepository.emails.push(email);

    console.log("MOCK EMAIL");
    console.log("----------------");
    console.log("TO:", input.to);
    console.log("SUBJECT:", input.subject);
    console.log(input.body);
    console.log("----------------");
  }

  static getEmails(): MockEmail[] {
    return [...MockEmailRepository.emails];
  }

  static clearEmails(): void {
    MockEmailRepository.emails = [];
  }
}
