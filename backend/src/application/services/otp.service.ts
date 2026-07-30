import { randomInt } from "node:crypto";

export class OtpService {
  generateCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  generateExpiration(): Date {
    return new Date(Date.now() + 3 * 60 * 1000);
  }
}
