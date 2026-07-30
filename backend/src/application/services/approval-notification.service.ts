import { ApprovalRepository } from "../ports/approval.repository";
import { NotificationRepository } from "../ports/notification.repository";
import { PurchaseRequest } from "../../domain/entities/purchase-request.entity";

export class ApprovalNotificationService {
  constructor(
    private readonly approvalRepository: ApprovalRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async notify(purchaseRequest: PurchaseRequest): Promise<void> {
    const approvals = await this.approvalRepository.findByPurchaseRequestId(purchaseRequest.id);

    // Mapeamos cada aprobación a una promesa de envío y las ejecutamos en paralelo
    const notificationPromises = approvals.map(async (approval) => {
      const baseUrl = process.env.APPROVAL_BASE_URL || "http://localhost:3001/approvals";
    const approvalLink =
        `${baseUrl}/approve?solicitud_id=${purchaseRequest.id}` +
        `&approver_token=${approval.data.approvalToken}`;

      await this.notificationRepository.send({
        to: approval.data.approverId,
        subject: "Solicitud de compra pendiente de aprobación",
        body: `
          Tienes una solicitud pendiente de aprobación.

          Solicitud:
          ${purchaseRequest.data.title}

          Descripción:
          ${purchaseRequest.data.description}

          Link de aprobación:
          ${approvalLink}
        `,
        url: approvalLink,
      });
    });

    // Esperamos a que todas las notificaciones se envíen simultáneamente
    await Promise.all(notificationPromises);
  }
}
