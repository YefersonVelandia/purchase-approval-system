export enum PurchaseRequestStatus {
  PENDING = "PENDING",
  SIGNED = "SIGNED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum ApproverRole {
  MANAGER = "MANAGER",
  FINANCE = "FINANCE",
  LEGAL = "LEGAL",
}

export interface Approver {
  name: string;
  email: string;
  role: ApproverRole;
}

export interface PurchaseRequestProps {
  id: string;
  title: string;
  description: string;
  amount: number;
  requesterId: string;
  approvers: Approver[];
  status: PurchaseRequestStatus;
  createdAt: Date;
}

export class PurchaseRequest {
  private constructor(private readonly props: PurchaseRequestProps) {}

  static create(props: PurchaseRequestProps): PurchaseRequest {
    if (!props.title.trim()) {
      throw new Error("Title is required");
    }

    if (props.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    if (!props.requesterId.trim()) {
      throw new Error("Requester id is required");
    }

    if (!props.approvers || props.approvers.length !== 3) {
      throw new Error("Exactly three approvers are required");
    }

    for (const approver of props.approvers) {
      if (!approver.name.trim()) {
        throw new Error("Approver name is required");
      }

      if (!approver.email.trim()) {
        throw new Error("Approver email is required");
      }

      if (!approver.role.trim()) {
        throw new Error("Approver role is required");
      }
    }

    const uniqueRoles = new Set(props.approvers.map((approver) => approver.role));

    if (uniqueRoles.size !== 3) {
      throw new Error("Approver roles must be unique");
    }

    const uniqueEmails = new Set(props.approvers.map((approver) => approver.email));

    if (uniqueEmails.size !== 3) {
      throw new Error("Approver emails must be unique");
    }

    return new PurchaseRequest({
      ...props,
      status: props.status ?? PurchaseRequestStatus.PENDING,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get data(): PurchaseRequestProps {
    return this.props;
  }

  changeStatus(status: PurchaseRequestStatus): PurchaseRequest {
    if (!this.canChangeStatus(status)) {
      throw new Error(`Cannot change status from ${this.props.status} to ${status}`);
    }

    return new PurchaseRequest({
      ...this.props,
      status,
    });
  }

  canChangeStatus(newStatus: PurchaseRequestStatus): boolean {
    // Si el nuevo estado es el mismo que el actual, permite el cambio (devuelve true)
    if (this.props.status === newStatus) {
      return true;
    }

    const transitions: Record<PurchaseRequestStatus, PurchaseRequestStatus[]> = {
      PENDING: [PurchaseRequestStatus.COMPLETED, PurchaseRequestStatus.REJECTED],
      SIGNED: [PurchaseRequestStatus.COMPLETED, PurchaseRequestStatus.REJECTED],
      REJECTED: [],
      COMPLETED: [],
    };

    return transitions[this.props.status].includes(newStatus);
  }
}
