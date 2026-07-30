import { ApprovalRepository } from "../ports/approval.repository";
import { OtpService } from "../services/otp.service";

interface GenerateApprovalOtpInput {
  approvalToken: string;
}

export class GenerateApprovalOtpUseCase {
  private readonly otpService: OtpService;

  constructor(private readonly approvalRepository: ApprovalRepository) {
    this.otpService = new OtpService();
  }

  async execute(input: GenerateApprovalOtpInput) {
    const approval = await this.approvalRepository.findByApprovalToken(input.approvalToken);

    if (!approval) {
      throw new Error("Approval not found");
    }

    const otpCode = this.otpService.generateCode();

    const otpExpiresAt = this.otpService.generateExpiration();

    const updatedApproval = approval.generateOtp(otpCode, otpExpiresAt);

    await this.approvalRepository.update(updatedApproval);

    return {
      approvalId: updatedApproval.id,
      otpCode,
      otpExpiresAt,
    };
  }
}
