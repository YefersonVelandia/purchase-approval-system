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
}
