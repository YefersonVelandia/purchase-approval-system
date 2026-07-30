param(
  [Parameter(Mandatory=$true)]
  [string]$ApiBaseUrl,
  [string]$BucketName,
  [string]$Region = "us-east-1"
)

# Si no se especifica BucketName, usar account-id como sufijo
if (-not $BucketName) {
  $AccountId = aws sts get-caller-identity --query Account --output text
  $BucketName = "purchase-approval-ui-$AccountId"
}

Write-Host "=== Build Frontend (producción) ===" -ForegroundColor Green
$FrontendUrl = "http://${BucketName}.s3-website-${Region}.amazonaws.com"
$env:MF_BASE_URL = $FrontendUrl
$env:API_BASE_URL = $ApiBaseUrl
pnpm build:production

$env:APPROVAL_BASE_URL = "${FrontendUrl}/shell/approvals"

Write-Host "=== Crear bucket S3 (si no existe) ===" -ForegroundColor Green
aws s3 mb "s3://${BucketName}" --region $Region 2>$null
if (-not $?) { Write-Host "Bucket ya existe o error ignorado" -ForegroundColor Yellow }

Write-Host "=== Subir assets a S3 ===" -ForegroundColor Green
aws s3 sync shell/dist/ "s3://${BucketName}/shell/" --region $Region --delete
aws s3 sync requests-mf/dist/ "s3://${BucketName}/requests-mf/" --region $Region --delete
aws s3 sync approvals-mf/dist/ "s3://${BucketName}/approvals-mf/" --region $Region --delete

Write-Host "=== Habilitar Static Website Hosting ===" -ForegroundColor Green
aws s3 website "s3://${BucketName}" `
  --index-document shell/index.html `
  --error-document shell/index.html

Write-Host "=== Configurar política de acceso público ===" -ForegroundColor Green
$Policy = @{
  Version = "2012-10-17"
  Statement = @(
    @{
      Effect = "Allow"
      Principal = "*"
      Action = "s3:GetObject"
      Resource = "arn:aws:s3:::${BucketName}/*"
    }
  )
} | ConvertTo-Json -Depth 10
$Policy | aws s3api put-bucket-policy --bucket $BucketName --policy file:///dev/stdin

Write-Host "=== Configurar CORS ===" -ForegroundColor Green
$CorsConfig = @{
  CORSRules = @(
    @{
      AllowedOrigins = @("*")
      AllowedMethods = @("GET", "HEAD")
      AllowedHeaders = @("*")
    }
  )
} | ConvertTo-Json -Depth 10
$CorsConfig | aws s3api put-bucket-cors --bucket $BucketName --cors-configuration file:///dev/stdin

Write-Host ""
Write-Host "=== DESPLIEGUE COMPLETO ===" -ForegroundColor Green
Write-Host "Frontend URL: http://${BucketName}.s3-website-${Region}.amazonaws.com/shell/"
Write-Host "API Base URL: ${ApiBaseUrl}" -ForegroundColor Cyan
