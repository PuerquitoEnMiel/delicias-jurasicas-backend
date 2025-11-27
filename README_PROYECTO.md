# 🦖 DELICIAS JURÁSICAS - Sistema ERP + E-commerce

Sistema completo de gestión para pastelería que integra:
- 🏪 **POS** (Punto de Venta)
- 🛒 **E-commerce** con carrito persistente
- 🏭 **ERP** (Manufacturing, Inventario, Tesorería)

## 📋 Stack Tecnológico

- **Backend**: NestJS 10 + TypeScript
- **ORM**: Prisma 5
- **Base de datos**: PostgreSQL 15+
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator

## 🚀 Instalación

### Requisitos Previos
- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Pasos de Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar archivo de configuración
copy .env.example .env

# 3. Configurar base de datos en .env
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/delicias_jurasicas"

# 4. Generar Prisma Client
npx prisma generate

# 5. Ejecutar migraciones
npx prisma migrate dev

# 6. Ejecutar seed (datos iniciales)
npx prisma db seed

# 7. Iniciar servidor
npm run start:dev
```

## 🌐 Acceso a la API

- **API Base**: `http://localhost:3000/api/v1`
- **Documentación Swagger**: `http://localhost:3000/api/docs`
- **Prisma Studio**: `npx prisma studio`

## 👤 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@deliciasjurasicas.com | Admin123! |
| Panadero | panadero@deliciasjurasicas.com | Panadero123! |
| Vendedor | vendedor@deliciasjurasicas.com | Vendedor123! |
| Cliente | cliente@example.com | Cliente123! |

##estructura del Proyecto

```
delicias-jurasicas/
├── prisma/
│   ├── schema.prisma          # Modelo de datos
│   └── seed.ts                # Datos iniciales
├── src/
│   ├── main.ts                # Punto de entrada
│   ├── app.module.ts          # Módulo raíz
│   ├── core/                  # Módulos core (Prisma, Config)
│   ├── auth/                  # Autenticación y autorización
│   ├── users/                 # Gestión de usuarios
│   ├── products/              # Catálogo de productos
│   ├── categories/            # Categorías
│   ├── recipes/               # Recetas (BOM)
│   ├── production/            # Órdenes de producción
│   ├── inventory/             # Control de inventario
│   ├── promotions/            # Promociones y descuentos
│   ├── cart/                  # Carrito de compras
│   ├── orders/                # Gestión de pedidos
│   ├── delivery/              # Entregas y logística
│   ├── cash-box/              # Control de caja
│   ├── reports/               # Reportes y analytics
│   └── settings/              # Configuración dinámica
└── uploads/                   # Archivos subidos
```

## 🔑 Funcionalidades Principales

### Gestión de Inventario
- ✅ Control de stock de insumos y productos
- ✅ Alertas de stock bajo
- ✅ Historial de movimientos
- ✅ Ajustes manuales

### Recetas y Producción
- ✅ Bill of Materials (BOM)
- ✅ Órdenes de producción
- ✅ Descuento automático de insumos
- ✅ Incremento de productos terminados

### Ventas
- ✅ Carrito persistente
- ✅ Promociones (%, 2x1, cupones)
- ✅ Pedidos online y POS
- ✅ Estados de pedido
- ✅ Integración con entregas

### Control de Caja
- ✅ Apertura y cierre de caja
- ✅ Arqueo automático
- ✅ Registro de transacciones
- ✅ Cálculo de faltantes/sobrantes

### Seguridad
- ✅ Autenticación JWT
- ✅ Control de acceso RBAC
- ✅ Auditoría inmutable
- ✅ Validación de datos

## 📊 Endpoints Principales

### Autenticación
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Perfil

### Productos
- `GET /api/v1/products` - Listar productos
- `GET /api/v1/products/featured` - Productos destacados
- `POST /api/v1/products` - Crear producto (Admin/Panadero)

### Producción
- `POST /api/v1/production/orders` - Crear orden de producción
- `PATCH /api/v1/production/orders/:id/complete` - **Completar producción** (descuenta insumos)

### Órdenes
- `POST /api/v1/orders` - Crear pedido
- `GET /api/v1/orders` - Listar pedidos
- `PATCH /api/v1/orders/:id/status` - Actualizar estado

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📦 Scripts Útiles

```bash
# Desarrollo
npm run start:dev      # Servidor con hot-reload

# Producción
npm run build          # Compilar
npm run start:prod     # Iniciar en producción

# Prisma
npx prisma studio      # Interfaz visual de BD
npx prisma migrate dev # Crear migración
npx prisma db seed     # Ejecutar seed

# Código
npm run format         # Formatear código
npm run lint           # Verificar linting
```

## 🔐 Variables de Entorno

Ver `.env.example` para la lista completa de variables configurables.

Variables clave:
- `DATABASE_URL`: Conexión a PostgreSQL
- `JWT_SECRET`: Secreto para tokens JWT
- `PORT`: Puerto del servidor (default: 3000)

## 📚 Documentación Adicional

- [Arquitectura NestJS](./ARQUITECTURA_NESTJS.md)
- [Flujo de Venta Online](./FLUJO_VENTA_ONLINE.md)
- [Relaciones del Schema](./RELACIONES_SCHEMA.md)

## 🤝 Contribución

Este es un proyecto educativo. Para contribuir:
1. Fork el repositorio
2. Crea una rama con tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE

## 👨‍💻 Soporte

Para preguntas o soporte:
- Email: soporte@deliciasjurasicas.com
- Documentación: `/api/docs`

---

**Desarrollado con ❤️ y 🦖 para Delicias Jurásicas**
