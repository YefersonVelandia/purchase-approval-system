import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { NotificationRepository } from "../../application/ports/notification.repository";

export interface MockEmail {
  to: string;
  subject: string;
  body: string;
  url?: string;
  sentAt: Date;
}

const STORAGE_DIR = join(process.cwd(), ".dynamodb");
const STORAGE_FILE = join(STORAGE_DIR, "mock-emails.json");

function loadEmails(): MockEmail[] {
  try {
    if (existsSync(STORAGE_FILE)) {
      const raw = readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed.map((e: MockEmail) => ({ ...e, sentAt: new Date(e.sentAt) }));
    }
  } catch {
    // ignore read errors
  }
  return [];
}

function saveEmails(emails: MockEmail[]): void {
  try {
    if (!existsSync(STORAGE_DIR)) {
      mkdirSync(STORAGE_DIR, { recursive: true });
    }
    writeFileSync(STORAGE_FILE, JSON.stringify(emails, null, 2), "utf-8");
  } catch {
    // ignore write errors
  }
}

export class MockEmailRepository implements NotificationRepository {
  async send(input: { to: string; subject: string; body: string; url?: string }): Promise<void> {
    const email: MockEmail = {
      to: input.to,
      subject: input.subject,
      body: input.body,
      url: input.url,
      sentAt: new Date(),
    };

    const emails = loadEmails();
    emails.push(email);
    saveEmails(emails);

    console.log("MOCK EMAIL");
    console.log("----------------");
    console.log("TO:", input.to);
    console.log("SUBJECT:", input.subject);
    console.log(input.body);
    console.log("----------------");
  }

  async list(): Promise<MockEmail[]> {
    return loadEmails();
  }

  async clear(): Promise<void> {
    saveEmails([]);
  }

  static getEmails(): MockEmail[] {
    return loadEmails();
  }

  static clearEmails(): void {
    saveEmails([]);
  }
}
