import PDFDocument from "pdfkit";

import { PurchaseRequestRepository } from "../ports/purchase-request.repository";
import { ApprovalRepository } from "../ports/approval.repository";
import { StorageRepository } from "../ports/storage.repository";

interface GenerateEvidencePdfInput {
  purchaseRequestId: string;
}

export class GenerateEvidencePdfUseCase {
  constructor(
    private readonly purchaseRequestRepository: PurchaseRequestRepository,
    private readonly approvalRepository: ApprovalRepository,
    private readonly storageRepository: StorageRepository,
  ) {}

  async execute(input: GenerateEvidencePdfInput): Promise<string> {
    const purchaseRequest = await this.purchaseRequestRepository.findById(input.purchaseRequestId);

    if (!purchaseRequest) {
      throw new Error("Purchase request not found");
    }

    if (purchaseRequest.data.status !== "COMPLETED") {
      throw new Error("Purchase request must be completed to generate evidence");
    }

    const approvals = await this.approvalRepository.findByPurchaseRequestId(input.purchaseRequestId);

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(20).text("Evidencia de Solicitud de Compra", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Título: ${purchaseRequest.data.title}`);
    doc.text(`Descripción: ${purchaseRequest.data.description}`);
    doc.text(`Monto: $${purchaseRequest.data.amount}`);
    doc.text(`Fecha: ${purchaseRequest.data.createdAt.toISOString()}`);
    doc.text(`Solicitante: ${purchaseRequest.data.requesterId}`);
    doc.text(`Estado: ${purchaseRequest.data.status}`);
    doc.moveDown();

    doc.fontSize(16).text("Aprobaciones", { underline: true });
    doc.moveDown();

    doc.fontSize(12);

    approvals.forEach((approval) => {
      doc.text(`Aprobador: ${approval.data.approverId}`);
      doc.text(`Estado: ${approval.data.status}`);
      doc.text(`Fecha Firma: ${approval.data.signedAt?.toISOString() || "N/A"}`);
      doc.text(`Firmado Por: ${approval.data.signedBy || "N/A"}`);
      doc.moveDown();
    });

    doc.end();

    await pdfPromise;

    const pdfBuffer = Buffer.concat(chunks);

    const key = `evidence/${input.purchaseRequestId}.pdf`;

    const url = await this.storageRepository.upload(key, pdfBuffer, "application/pdf");

    return url;
  }
}
