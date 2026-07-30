import PDFDocument from "pdfkit";
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { DynamoDBPurchaseRequestRepository } from "../../infrastructure/repositories/dynamodb-purchase-request.repository";
import { DynamoDBApprovalRepository } from "../../infrastructure/repositories/dynamodb-approval.repository";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing purchase request id" }),
      };
    }

    const purchaseRequestRepository = new DynamoDBPurchaseRequestRepository();
    const approvalRepository = new DynamoDBApprovalRepository();

    const purchaseRequest = await purchaseRequestRepository.findById(id);

    if (!purchaseRequest) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Purchase request not found" }),
      };
    }

    if (purchaseRequest.data.status !== "COMPLETED") {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Purchase request must be completed to download evidence" }),
      };
    }

    const approvals = await approvalRepository.findByPurchaseRequestId(id);

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

    for (const approval of approvals) {
      doc.text(`Aprobador: ${approval.data.approverId}`);
      doc.text(`Estado: ${approval.data.status}`);
      doc.text(`Fecha Firma: ${approval.data.signedAt?.toISOString() || "N/A"}`);
      doc.text(`Firmado Por: ${approval.data.signedBy || "N/A"}`);
      doc.moveDown();
    }

    doc.end();

    await pdfPromise;

    const pdfBuffer = Buffer.concat(chunks);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="evidencia-${id}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
      body: pdfBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : "Internal server error",
      }),
    };
  }
};
