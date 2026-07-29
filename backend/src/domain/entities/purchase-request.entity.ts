export enum PurchaseRequestStatus {
  PENDING = "PENDING",
  SIGNED = "SIGNED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export interface PurchaseRequestProps {
  id: string;
  title: string;
  description: string;
  amount: number;
  requesterId: string;
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
      PENDING: [PurchaseRequestStatus.SIGNED, PurchaseRequestStatus.REJECTED],
      SIGNED: [PurchaseRequestStatus.COMPLETED, PurchaseRequestStatus.REJECTED],
      REJECTED: [],
      COMPLETED: [],
    };

    return transitions[this.props.status].includes(newStatus);
  }
}
