export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ApprovalProps {
  id: string;
  purchaseRequestId: string;
  approverId: string;
  status: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
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

    return new Approval({
      ...props,
      status: props.status ?? ApprovalStatus.PENDING,
    });
  }

  changeStatus(status: ApprovalStatus): Approval {
    if (!this.canChangeStatus(status)) {
      throw new Error(`Cannot change approval status from ${this.props.status} to ${status}`);
    }

    return new Approval({
      ...this.props,
      status,
      updatedAt: new Date(),
    });
  }

  private canChangeStatus(newStatus: ApprovalStatus): boolean {
    if (this.props.status === newStatus) {
      return true;
    }

    const transitions: Record<ApprovalStatus, ApprovalStatus[]> = {
      PENDING: [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED],
      APPROVED: [],
      REJECTED: [],
    };

    return transitions[this.props.status].includes(newStatus);
  }

  get id(): string {
    return this.props.id;
  }

  get data(): ApprovalProps {
    return this.props;
  }
}
