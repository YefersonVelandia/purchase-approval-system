#!/bin/bash
# Script de deploy del frontend a S3 Static Website
# Requisitos: AWS CLI configurado, pnpm instalado
# Uso: ./deploy.sh <api-base-url> [bucket-name] [region]

set -euo pipefail

API_BASE_URL="${1:?Uso: ./deploy.sh <api-base-url> [bucket-name] [region]}"
BUCKET_NAME="${2:-purchase-approval-ui-$(aws sts get-caller-identity --query Account --output text)}"
REGION="${3:-us-east-1}"

echo "=== Build Frontend (producción) ==="
MF_BASE_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com" \
  API_BASE_URL="${API_BASE_URL}" \
  pnpm build:production

echo "=== Crear bucket S3 (si no existe) ==="
aws s3 mb "s3://${BUCKET_NAME}" --region "${REGION}" 2>/dev/null || true

echo "=== Subir assets a S3 ==="
aws s3 sync shell/dist/ "s3://${BUCKET_NAME}/shell/" --region "${REGION}" --delete
aws s3 sync requests-mf/dist/ "s3://${BUCKET_NAME}/requests-mf/" --region "${REGION}" --delete
aws s3 sync approvals-mf/dist/ "s3://${BUCKET_NAME}/approvals-mf/" --region "${REGION}" --delete

echo "=== Habilitar Static Website Hosting ==="
aws s3 website "s3://${BUCKET_NAME}" \
  --index-document shell/index.html \
  --error-document shell/index.html

echo "=== Configurar política de acceso público ==="
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF
aws s3api put-bucket-policy --bucket "${BUCKET_NAME}" --policy file:///tmp/bucket-policy.json
rm -f /tmp/bucket-policy.json

echo "=== Configurar CORS ==="
cat > /tmp/cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"]
    }
  ]
}
EOF
aws s3api put-bucket-cors --bucket "${BUCKET_NAME}" --cors-configuration file:///tmp/cors-config.json
rm -f /tmp/cors-config.json

echo ""
echo "=== DESPLIEGUE COMPLETO ==="
echo "Frontend URL: http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com/shell/"
echo "API Base URL: ${API_BASE_URL}"
