export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ApprovalProps {
  id: string;
  purchaseRequestId: string;
  approverId: string;
  approvalToken: string;
  status: ApprovalStatus;
  otpCode?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  signedBy?: string;
}

export class Approval {
  private constructor(private readonly props: ApprovalProps) {}

  static create(props: ApprovalProps): Approval {
    if (!props.purchaseRequestId.trim()) {
      throw new Error("Purchase request id is required");
    }

    if (!props.approverId.trim()) {
      throw new Error("Approver id is required");
    }

    if (!props.approvalToken.trim()) {
      throw new Error("Approval token is required");
    }

    return new Approval({
      ...props,
      status: props.status ?? ApprovalStatus.PENDING,
    });
  }

  changeStatus(status: ApprovalStatus, signedBy?: string): Approval {
    // Una vez APPROVED o REJECTED, el estado es irreversible
    if (this.props.status === ApprovalStatus.APPROVED && status !== ApprovalStatus.APPROVED) {
      throw new Error(`Cannot change approval status from ${this.props.status} to ${status}`);
    }

    if (this.props.status === ApprovalStatus.REJECTED && status !== ApprovalStatus.REJECTED) {
      throw new Error(`Cannot change approval status from ${this.props.status} to ${status}`);
    }

    const signedAt = status === ApprovalStatus.APPROVED || status === ApprovalStatus.REJECTED 
      ? new Date() 
      : undefined;

    return new Approval({
      ...this.props,
      status,
      updatedAt: new Date(),
      signedAt,
      signedBy: signedBy || this.props.signedBy,
    });
  }

  generateOtp(otpCode: string, otpExpiresAt: Date): Approval {
    return new Approval({
      ...this.props,
      otpCode,
      otpExpiresAt,
      updatedAt: new Date(),
    });
  }

  // Valida OTP por comparación directa + verificación de expiración (3 min)
  isOtpValid(code: string): boolean {
    if (!this.props.otpCode || !this.props.otpExpiresAt) {
      return false;
    }

    return this.props.otpCode === code && this.props.otpExpiresAt.getTime() > Date.now();
  }

  get id(): string {
    return this.props.id;
  }

  get data(): ApprovalProps {
    return this.props;
  }
}
