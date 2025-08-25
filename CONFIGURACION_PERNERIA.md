# Configuración para Perneria Aqui me quedo

## Resumen de Cambios Realizados

### 1. Configuración del Proyecto
- ✅ **Nombre del proyecto**: Cambiado a "Perneria Aqui me quedo"
- ✅ **Descripción**: Sistema de gestión para pernería
- ✅ **Base de datos**: `perneria_aqui_me_quedo`
- ✅ **Email**: `info@perneriaaquimequedo.com`

### 2. Personalización Visual
- ✅ **Logo personalizado**: Creado logo específico para la pernería
- ✅ **Títulos**: Actualizados en todas las vistas
- ✅ **Branding**: Colores y estilos específicos del negocio

### 3. Configuración de Datos
- ✅ **Categorías de productos**: Pernos, Tuercas, Arandelas, Tornillos, Herramientas, etc.
- ✅ **Marcas populares**: Stanley, DeWalt, Makita, Bosch, Milwaukee, etc.
- ✅ **Métodos de pago**: Efectivo, Tarjeta, Transferencia, Cheque
- ✅ **Tipos de cliente**: Individual, Empresa, Gobierno

### 4. Funcionalidades Específicas
- ✅ **Helper personalizado**: `PerneriaHelper` con funciones específicas
- ✅ **Configuración específica**: Archivo `config/perneria.php`
- ✅ **Seeder personalizado**: Datos iniciales para la pernería
- ✅ **Facturación**: Configurada para el negocio

## Archivos Modificados

### Archivos de Configuración
- `composer.json` - Información del proyecto
- `config/app.php` - Nombre de la aplicación
- `config/perneria.php` - Configuración específica (NUEVO)
- `.env` - Variables de entorno

### Archivos de Vistas
- `resources/views/components/application-logo.blade.php` - Logo personalizado
- `resources/views/layouts/app.blade.php` - Título de la aplicación
- `resources/views/dashboard.blade.php` - Título del dashboard

### Archivos de Datos
- `database/seeders/PerneriaSeeder.php` - Datos iniciales (NUEVO)
- `database/seeders/DatabaseSeeder.php` - Incluye el nuevo seeder

### Archivos de Funciones
- `app/Helpers/PerneriaHelper.php` - Helper específico (NUEVO)
- `app/helpers.php` - Incluye el nuevo helper

### Documentación
- `README-PERNERIA.md` - Documentación específica del proyecto (NUEVO)
- `CONFIGURACION_PERNERIA.md` - Este archivo (NUEVO)

## Configuración de Base de Datos

### Crear la base de datos
```sql
CREATE DATABASE perneria_aqui_me_quedo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Ejecutar migraciones y seeders
```bash
php artisan migrate
php artisan db:seed
```

## Configuración de Correo

El sistema está configurado para enviar correos desde:
- **Email**: info@perneriaaquimequedo.com
- **Nombre**: Perneria Aqui me quedo

## Funciones Específicas Disponibles

### PerneriaHelper
- `formatPrice()` - Formatear precios
- `calculateTax()` - Calcular IVA
- `generateInvoiceNumber()` - Generar números de factura
- `checkLowStock()` - Verificar stock bajo
- `getCompanyInfo()` - Información de la empresa
- `getPaymentMethods()` - Métodos de pago
- `getProductCategories()` - Categorías de productos

## Próximos Pasos

1. **Configurar base de datos**:
   ```bash
   # Editar .env con credenciales de tu base de datos
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=perneria_aqui_me_quedo
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_password
   ```

2. **Ejecutar migraciones**:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

3. **Compilar assets**:
   ```bash
   npm install
   npm run dev
   ```

4. **Iniciar servidor**:
   ```bash
   php artisan serve
   ```

## Credenciales de Acceso

- **Email**: admin@perneriaaquimequedo.com
- **Password**: password

## Personalización Adicional

### Cambiar información de la empresa
Editar el archivo `config/perneria.php`:
```php
'empresa' => [
    'nombre' => 'Perneria Aqui me quedo',
    'direccion' => 'Tu dirección aquí',
    'telefono' => 'Tu teléfono aquí',
    'email' => 'tu@email.com',
    'ruc' => 'Tu RUC aquí',
],
```

### Cambiar configuración de facturación
```php
'facturacion' => [
    'tipo_documento' => 'FACTURA',
    'prefijo' => 'FAC',
    'impuesto' => 10.0, // Porcentaje de IVA
],
```

## Soporte

Para cualquier consulta o soporte técnico, contactar al equipo de desarrollo.

---

**Sistema personalizado para Perneria Aqui me quedo** 🏪

