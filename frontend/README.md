# Purchase Approval System

Sistema frontend basado en micro-frontends con Webpack Module Federation y backend independiente.

## Requisitos previos

Antes de iniciar el proyecto asegúrate de tener instalado:

- **Node.js 20+**
- **pnpm**

Para instalar pnpm globalmente:

```bash
npm install -g pnpm
```

Puedes verificar las versiones:

```bash
node -v
pnpm -v
```

---

## Instalación

Desde la raíz del repositorio ejecuta:

```bash
cd C:\Users\asus\OneDrive\Documentos\proyectos\purchase-approval-system

pnpm install
```

Esto instalará las dependencias del backend y frontend.

---

## Iniciar el sistema

El proyecto requiere iniciar primero el backend y luego el frontend.

### 1. Iniciar backend

En una terminal:

```bash
cd backend

pnpm dev
```

El backend quedará disponible para los micro-frontends.

---

### 2. Iniciar frontend

En otra terminal:

```bash
cd frontend

pnpm dev
```

Este comando levanta todos los micro-frontends en paralelo.

---

## Micro-frontends disponibles

| Aplicación                   | URL                   |
| ---------------------------- | --------------------- |
| Shell (aplicación principal) | http://localhost:3001 |
| Requests MF                  | http://localhost:3002 |
| Approvals MF                 | http://localhost:3003 |

---

## Acceso a la aplicación

Abre en el navegador:

```
http://localhost:3001
```

El Shell cargará los micro-frontends mediante **Webpack Module Federation**.

---

## Arquitectura

```
purchase-approval-system
│
├── backend
│   └── API
│
└── frontend
    │
    ├── shell
    │   └── Host principal (puerto 3001)
    │
    ├── requests-mf
    │   └── Microfrontend Requests (puerto 3002)
    │
    └── approvals-mf
        └── Microfrontend Approvals (puerto 3003)
```

---

## Comandos útiles

### Detener servidores

En la terminal donde están corriendo:

```
Ctrl + C
```

### Ejecutar frontend completo

Desde `frontend`:

```bash
pnpm dev
```

### Construir proyectos

Backend:

```bash
cd backend
pnpm build
```

Frontend:

```bash
cd frontend
pnpm build
```
