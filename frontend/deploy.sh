#!/bin/bash
# Script de deploy del frontend a S3 Static Website
# Requisitos:
# - AWS CLI configurado
# - pnpm instalado
#
# Uso:
# ./deploy.sh <api-base-url> [bucket-name] [region]

set -euo pipefail

API_BASE_URL="${1:?Uso: ./deploy.sh <api-base-url> [bucket-name] [region]}"
BUCKET_NAME="${2:-purchase-approval-ui-$(aws sts get-caller-identity --query Account --output text)}"
REGION="${3:-us-east-1}"

FRONTEND_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

echo "======================================"
echo "=== Build Frontend (producción) ==="
echo "======================================"

FRONTEND_URL="${FRONTEND_URL}" \
REQUESTS_MF_URL="${FRONTEND_URL}/requests-mf/remoteEntry.js" \
APPROVALS_MF_URL="${FRONTEND_URL}/approvals-mf/remoteEntry.js" \
API_BASE_URL="${API_BASE_URL}" \
pnpm build:production


echo ""
echo "======================================"
echo "=== Crear bucket S3 (si no existe) ==="
echo "======================================"

aws s3 mb "s3://${BUCKET_NAME}" --region "${REGION}" 2>/dev/null || true


echo ""
echo "======================================"
echo "=== Subir Shell a raíz del bucket ==="
echo "======================================"

aws s3 sync shell/dist/ \
  "s3://${BUCKET_NAME}/" \
  --region "${REGION}" \
  --delete


echo ""
echo "======================================"
echo "=== Subir Requests MF ==="
echo "======================================"

aws s3 sync requests-mf/dist/ \
  "s3://${BUCKET_NAME}/requests-mf/" \
  --region "${REGION}" \
  --delete


echo ""
echo "======================================"
echo "=== Subir Approvals MF ==="
echo "======================================"

aws s3 sync approvals-mf/dist/ \
  "s3://${BUCKET_NAME}/approvals-mf/" \
  --region "${REGION}" \
  --delete


echo ""
echo "======================================"
echo "=== Habilitar Static Website Hosting ==="
echo "======================================"

aws s3 website "s3://${BUCKET_NAME}" \
  --index-document index.html \
  --error-document index.html


echo ""
echo "======================================"
echo "=== Configurar política pública ==="
echo "======================================"

cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket "${BUCKET_NAME}" \
  --policy file://bucket-policy.json

rm -f bucket-policy.json


echo ""
echo "======================================"
echo "=== Configurar CORS ==="
echo "======================================"

cat > cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "*"
      ],
      "AllowedMethods": [
        "GET",
        "HEAD"
      ],
      "AllowedHeaders": [
        "*"
      ],
      "ExposeHeaders": [
        "ETag"
      ]
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket "${BUCKET_NAME}" \
  --cors-configuration file://cors-config.json

rm -f cors-config.json

echo ""
echo "======================================"
echo "=== DESPLIEGUE COMPLETO ==="
echo "======================================"

echo ""
echo "Frontend URL:"
echo "${FRONTEND_URL}/"

echo ""
echo "Requests MF:"
echo "${FRONTEND_URL}/requests-mf/remoteEntry.js"

echo ""
echo "Approvals MF:"
echo "${FRONTEND_URL}/approvals-mf/remoteEntry.js"

echo ""
echo "API Base URL:"
echo "${API_BASE_URL}"