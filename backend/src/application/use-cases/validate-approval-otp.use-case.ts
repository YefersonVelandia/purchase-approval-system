import { ApprovalRepository } from "../ports/approval.repository";

interface ValidateApprovalOtpInput {
  approvalToken: string;
  otpCode: string;
}

export class ValidateApprovalOtpUseCase {
  constructor(private readonly approvalRepository: ApprovalRepository) {}

  async execute(input: ValidateApprovalOtpInput) {
    const approval = await this.approvalRepository.findByApprovalToken(input.approvalToken);

    if (!approval) {
      throw new Error("Approval not found");
    }

    const isValid = approval.isOtpValid(input.otpCode);

    if (!isValid) {
      throw new Error("Invalid or expired OTP");
    }

    return {
      approvalId: approval.id,
      purchaseRequestId: approval.data.purchaseRequestId,
      approverId: approval.data.approverId,
    };
  }
}
