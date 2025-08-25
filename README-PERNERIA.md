# Perneria Aqui me quedo - Sistema de Gestión

## Descripción
Sistema de gestión integral para la pernería "Aqui me quedo", desarrollado en Laravel 10. Este sistema incluye gestión de inventario, ventas, clientes, proveedores y reportes.

## Características Principales

### 🏪 Gestión de Inventario
- Control de stock de productos
- Categorización de productos
- Alertas de stock bajo
- Gestión de marcas y proveedores

### 💰 Gestión de Ventas
- Registro de ventas
- Facturación electrónica
- Control de pagos
- Reportes de ventas

### 👥 Gestión de Clientes
- Base de datos de clientes
- Historial de compras
- Gestión de créditos
- Comunicación por correo

### 📊 Reportes y Analytics
- Dashboard con estadísticas en tiempo real
- Reportes de ventas por período
- Análisis de productos más vendidos
- Gráficos interactivos

### 🤖 Integración con IA
- Chat asistente inteligente
- Recomendaciones de productos
- Análisis predictivo de ventas

## Instalación

### Requisitos Previos
- PHP 8.1 o superior
- Composer
- MySQL 5.7 o superior
- Node.js y NPM

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd perneria-aqui-me-quedo
```

2. **Instalar dependencias de PHP**
```bash
composer install
```

3. **Instalar dependencias de Node.js**
```bash
npm install
```

4. **Configurar el archivo .env**
```bash
cp .env.example .env
```

Editar el archivo `.env` con la configuración de tu base de datos:
```env
APP_NAME="Perneria Aqui me quedo"
DB_DATABASE=perneria_aqui_me_quedo
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

5. **Generar clave de aplicación**
```bash
php artisan key:generate
```

6. **Ejecutar migraciones**
```bash
php artisan migrate
```

7. **Ejecutar seeders (opcional)**
```bash
php artisan db:seed
```

8. **Compilar assets**
```bash
npm run dev
```

9. **Iniciar el servidor**
```bash
php artisan serve
```

## Configuración de Base de Datos

### Crear la base de datos
```sql
CREATE DATABASE perneria_aqui_me_quedo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Ejecutar migraciones
```bash
php artisan migrate
```

## Estructura del Proyecto

```
app/
├── Http/Controllers/     # Controladores de la aplicación
├── Models/              # Modelos de Eloquent
├── Services/            # Servicios de negocio
├── Mail/               # Clases de correo electrónico
└── Helpers/            # Funciones auxiliares

resources/
├── views/              # Vistas Blade
├── css/               # Estilos CSS
└── js/                # JavaScript

database/
├── migrations/         # Migraciones de base de datos
├── seeders/           # Seeders para datos iniciales
└── data/              # Datos JSON de catálogos
```

## Módulos Principales

### 1. Dashboard
- Estadísticas generales
- Gráficos de ventas
- Productos más vendidos
- Alertas de stock

### 2. Inventario
- Gestión de productos
- Control de stock
- Categorías y marcas
- Proveedores

### 3. Ventas
- Registro de ventas
- Facturación
- Gestión de pagos
- Reportes

### 4. Clientes
- Base de datos de clientes
- Historial de compras
- Gestión de créditos

### 5. Reportes
- Reportes de ventas
- Análisis de productos
- Estadísticas por período

## Configuración de Correo

Para el envío de facturas y notificaciones, configurar en `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=tu_servidor_smtp
MAIL_PORT=587
MAIL_USERNAME=tu_email
MAIL_PASSWORD=tu_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@perneriaaquimequedo.com
MAIL_FROM_NAME="Perneria Aqui me quedo"
```

## Comandos Útiles

### Generar facturas
```bash
php artisan generate:invoice [sale_id]
```

### Backup de base de datos
```bash
php artisan backup:database
```

### Limpiar cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

## Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

## Licencia

Este proyecto es propiedad de "Perneria Aqui me quedo" y está destinado exclusivamente para su uso interno.

---

**Desarrollado con ❤️ para Perneria Aqui me quedo**

