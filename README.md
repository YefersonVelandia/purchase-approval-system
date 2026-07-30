# Purchase Approval System

Sistema de flujo de aprobaciones con firma digital concatenada.

## Arquitectura

Monorepo con:

- Backend serverless AWS.
- Frontend React.
- DynamoDB.
- AWS Lambda.

### Arquitectura Backend (Domain Driven Design)

```
backend/src/
├── adapters/           # Controladores y handlers HTTP
│   ├── controllers/    # Validación y coordinación
│   ├── handlers/       # Lambda handlers (API Gateway)
│   └── middlewares/    # Middleware de errores
├── application/        # Lógica de aplicación
│   ├── dto/           # Data Transfer Objects y schemas Zod
│   ├── ports/         # Interfaces de repositorios y servicios
│   ├── services/      # Servicios de dominio (OTP, notificaciones)
│   └── use-cases/     # Casos de uso
├── domain/            # Lógica de dominio pura
│   └── entities/      # Entidades (PurchaseRequest, Approval)
└── infrastructure/    # Implementaciones concretas
    ├── notifications/ # MockEmailRepository
    ├── repositories/  # DynamoDB repositories
    └── storage/      # MockStorageRepository (PDF)
```

### Entidades de Dominio

**PurchaseRequest**

- Estados: `PENDING`, `COMPLETED`, `REJECTED`
- Requiere exactamente 3 aprobadores con roles únicos (MANAGER, FINANCE, LEGAL)
- Transiciones: PENDING → COMPLETED/REJECTED

**Approval**

- Estados: `PENDING`, `APPROVED`, `REJECTED`
- Contiene OTP para validación (3 minutos de validez)
- Registra `signedAt` y `signedBy` al aprobar/rechazar

### Tablas DynamoDB

**purchase-requests**

- PK: `REQUEST#{id}`
- SK: `METADATA`
- Atributos: title, description, amount, requesterId, approvers, status, createdAt

**approvals**

- PK: `APPROVAL#{id}`
- SK: `METADATA`
- Atributos: purchaseRequestId, approverId, approvalToken, status, otpCode, otpExpiresAt, signedAt, signedBy

## Stack

### Backend

- Node.js
- TypeScript
- Serverless Framework
- AWS Lambda
- DynamoDB
- pdfkit (generación de PDF)

### Frontend

- React
- TypeScript
- Micro Frontends

## Endpoints API

### Solicitud de Compra

- `POST /purchase-requests` - Crear solicitud de compra

  - Body: `{ title, description, amount, requesterId, approvers: [{ name, email, role }] }`
  - Respuesta: `{ id, title, description, amount, requesterId, approvers, status, createdAt }`

- `GET /purchase-requests/{id}` - Obtener solicitud por ID
- `GET /purchase-requests` - Listar todas las solicitudes

### Aprobaciones

- `POST /approvals` - Crear aprobación (automático al crear solicitud)
- `GET /approvals?purchaseRequestId={id}` - Listar aprobaciones de una solicitud
- `PATCH /approvals/{id}/status` - Actualizar estado de aprobación
  - Body: `{ status: "APPROVED" | "REJECTED", signedBy?: string }`
  - Respuesta: `{ id, status, signedAt, signedBy }`

### OTP (One-Time Password)

- `GET /approvals/{token}/otp` - Generar OTP para aprobación
  - Respuesta: `{ approvalId, otpExpiresAt }`
- `POST /approvals/{token}/validate-otp` - Validar OTP
  - Body: `{ otpCode }`
  - Respuesta: `{ approvalId, purchaseRequestId, approverId }`

### Mock Email

- `GET /mock-mail` - Obtener emails simulados enviados
  - Respuesta: `[{ to, subject, body, url, sentAt }]`

### Evidencia PDF

- `GET /api/solicitudes/{id}/evidencia.pdf` - Generar y descargar PDF de evidencia
  - Solo disponible para solicitudes en estado COMPLETED
  - Respuesta: `{ url, message }`

### Health

- `GET /health` - Health check

## Ejemplos de Eventos Lambda

### Crear Solicitud de Compra

```json
{
  "body": "{\"title\":\"Laptop\",\"description\":\"Developer laptop\",\"amount\":1500,\"requesterId\":\"user-123\",\"approvers\":[{\"name\":\"Juan Perez\",\"email\":\"juan@empresa.com\",\"role\":\"MANAGER\"},{\"name\":\"Maria Gomez\",\"email\":\"maria@empresa.com\",\"role\":\"FINANCE\"},{\"name\":\"Carlos Ruiz\",\"email\":\"carlos@empresa.com\",\"role\":\"LEGAL\"}]}",
  "headers": {},
  "requestContext": {}
}
```

### Actualizar Estado de Aprobación

```json
{
  "body": "{\"status\":\"APPROVED\",\"signedBy\":\"juan@empresa.com\"}",
  "pathParameters": {
    "id": "approval-123"
  }
}
```

### Validar OTP

```json
{
  "body": "{\"otpCode\":\"123456\"}",
  "pathParameters": {
    "token": "approval-token-xyz"
  }
}
```

## Ejecución Local

### Instalar dependencias

```bash
pnpm install
```

### Ejecutar tests

```bash
pnpm test
```

### Validar TypeScript

```bash
pnpm exec tsc --noEmit
```

### Iniciar API Local (Serverless Offline)

El backend usa Serverless Offline para simular AWS Lambda y API Gateway localmente, junto con DynamoDB Local para la base de datos.

```bash
cd backend
pnpm dev
```

Esto iniciará:

- **API REST** en `http://localhost:3000`
- **DynamoDB Local** en `http://localhost:8000`
- Todas las funciones Lambda simuladas localmente

### Endpoints Locales

Una vez iniciado el servidor local, puedes acceder a:

- `POST http://localhost:3000/purchase-requests` - Crear solicitud
- `GET http://localhost:3000/purchase-requests/{id}` - Obtener solicitud
- `GET http://localhost:3000/purchase-requests` - Listar solicitudes
- `POST http://localhost:3000/approvals` - Crear aprobación
- `GET http://localhost:3000/approvals?purchaseRequestId={id}` - Listar aprobaciones
- `PATCH http://localhost:3000/approvals/{id}/status` - Actualizar estado aprobación
- `GET http://localhost:3000/approvals/{token}/otp` - Generar OTP
- `POST http://localhost:3000/approvals/{token}/validate-otp` - Validar OTP
- `GET http://localhost:3000/mock-mail` - Ver emails simulados
- `GET http://localhost:3000/api/solicitudes/{id}/evidencia.pdf` - Generar PDF evidencia
- `GET http://localhost:3000/health` - Health check

### Ejemplo de Prueba Local

```bash
# Crear una solicitud de compra
curl -X POST http://localhost:3000/purchase-requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop",
    "description": "Developer laptop",
    "amount": 1500,
    "requesterId": "user-123",
    "approvers": [
      {"name": "Juan Perez", "email": "juan@empresa.com", "role": "MANAGER"},
      {"name": "Maria Gomez", "email": "maria@empresa.com", "role": "FINANCE"},
      {"name": "Carlos Ruiz", "email": "carlos@empresa.com", "role": "LEGAL"}
    ]
  }'
```

### Invocar Lambda localmente

```bash
cd backend
pnpm exec serverless invoke local --function createPurchaseRequest --path events/create-purchase-request.json
```

## Despliegue

### Requisitos Previos

- AWS CLI configurado con credenciales
- Node.js 20+
- pnpm

### Despliegue en AWS

```bash
cd backend

# Desplegar en ambiente dev (default)
serverless deploy

# Desplegar en ambiente prod
serverless deploy --stage prod
```

El despliegue crea automáticamente:

- Tablas DynamoDB: PurchaseRequests, Approvals con GSI
- Bucket S3: purchase-evidence-bucket-{stage}
- API Gateway con todos los endpoints
- Lambdas con permisos IAM necesarios

### Variables de Entorno

El sistema usa las siguientes variables de entorno (configuradas automáticamente en serverless.yml):

- `PURCHASE_REQUESTS_TABLE`: Nombre de tabla DynamoDB para solicitudes
- `APPROVALS_TABLE`: Nombre de tabla DynamoDB para aprobaciones
- `S3_BUCKET_NAME`: Nombre del bucket S3 para evidencias PDF
- `NODE_ENV`: Ambiente (dev/prod) - determina si usar Mock o S3 real

### Storage Repository

El sistema usa automáticamente:

- **MockStorageRepository** en ambiente `dev` o `test` (almacenamiento en memoria)
- **S3StorageRepository** en ambientes de producción (almacenamiento en S3 real)
