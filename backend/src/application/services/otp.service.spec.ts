import { OtpService } from "./otp.service";

describe("OtpService", () => {
  it("should generate a 6 digit otp", () => {
    const service = new OtpService();

    const otp = service.generateCode();

    expect(otp).toHaveLength(6);
  });

  it("should generate expiration in 3 minutes", () => {
    const service = new OtpService();

    const before = Date.now();

    const expiration = service.generateExpiration();

    const after = Date.now();

    expect(expiration.getTime()).toBeGreaterThan(before + 2 * 60 * 1000);

    expect(expiration.getTime()).toBeLessThan(after + 4 * 60 * 1000);
  });
});
