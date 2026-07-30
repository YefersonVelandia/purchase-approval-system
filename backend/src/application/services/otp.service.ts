export class OtpService {
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateExpiration(): Date {
    const expiration = new Date();

    expiration.setMinutes(expiration.getMinutes() + 3);

    return expiration;
  }
}
