# Docker Simple para Perneria Aqui me quedo

## Descripción
Configuración Docker simplificada para el sistema de gestión "Perneria Aqui me quedo" con solo los servicios esenciales.

## Servicios Incluidos

### 🐳 Contenedores Principales

1. **app** - Aplicación Laravel (PHP 8.2 + Apache)
   - Puerto: 8002
   - Contenedor: perneria-app

2. **db** - Base de datos MySQL 8.0
   - Puerto: 3308
   - Contenedor: perneria-db
   - Base de datos: perneria_aqui_me_quedo

## Instalación Rápida

### Script Automático
```bash
# Dar permisos de ejecución
chmod +x docker-start-perneria-simple.sh

# Ejecutar script de configuración
./docker-start-perneria-simple.sh
```

### Comandos Manuales
```bash
# 1. Crear archivo .env
cp .env.example .env

# 2. Construir contenedores
docker-compose -f docker-compose-perneria-simple.yml build --no-cache

# 3. Levantar servicios
docker-compose -f docker-compose-perneria-simple.yml up -d

# 4. Generar clave de aplicación
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan key:generate

# 5. Crear directorios de storage
docker-compose -f docker-compose-perneria-simple.yml exec app mkdir -p /var/www/html/storage/framework/sessions
docker-compose -f docker-compose-perneria-simple.yml exec app mkdir -p /var/www/html/storage/framework/cache
docker-compose -f docker-compose-perneria-simple.yml exec app mkdir -p /var/www/html/storage/framework/views
docker-compose -f docker-compose-perneria-simple.yml exec app mkdir -p /var/www/html/storage/logs

# 6. Configurar permisos
docker-compose -f docker-compose-perneria-simple.yml exec app chmod -R 777 /var/www/html/storage
docker-compose -f docker-compose-perneria-simple.yml exec app chmod -R 777 /var/www/html/bootstrap/cache

# 7. Crear enlace simbólico
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan storage:link
```

## Acceso a los Servicios

### 🌐 Aplicación Web
- **URL**: http://localhost:8002
- **Credenciales**:
  - Email: admin@perneriaaquimequedo.com
  - Password: password

### 🗄️ Base de Datos MySQL
- **Host**: localhost
- **Puerto**: 3308
- **Usuario**: root
- **Contraseña**: root
- **Base de datos**: perneria_aqui_me_quedo

## Configuración de Base de Datos

### Variables de Entorno (.env)
```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=perneria_aqui_me_quedo
DB_USERNAME=root
DB_PASSWORD=root
```

### Configurar Base de Datos Manualmente

1. **Conectar a MySQL**:
   ```bash
   # Usando mysql client
   mysql -h localhost -P 3308 -u root -p
   
   # O usando Docker
   docker-compose -f docker-compose-perneria-simple.yml exec db mysql -u root -p
   ```

2. **Ejecutar migraciones**:
   ```bash
   docker-compose -f docker-compose-perneria-simple.yml exec app php artisan migrate
   ```

3. **Ejecutar seeders**:
   ```bash
   docker-compose -f docker-compose-perneria-simple.yml exec app php artisan db:seed
   ```

## Comandos Útiles

### Gestión de Contenedores
```bash
# Ver logs de la aplicación
docker-compose -f docker-compose-perneria-simple.yml logs -f app

# Ver logs de la base de datos
docker-compose -f docker-compose-perneria-simple.yml logs -f db

# Entrar al contenedor de la aplicación
docker-compose -f docker-compose-perneria-simple.yml exec app bash

# Entrar al contenedor de la base de datos
docker-compose -f docker-compose-perneria-simple.yml exec db mysql -u root -p

# Detener todos los servicios
docker-compose -f docker-compose-perneria-simple.yml down

# Levantar servicios en segundo plano
docker-compose -f docker-compose-perneria-simple.yml up -d

# Reconstruir contenedores
docker-compose -f docker-compose-perneria-simple.yml build --no-cache
```

### Comandos Laravel
```bash
# Ejecutar migraciones
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan migrate

# Ejecutar seeders
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan db:seed

# Limpiar cache
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan cache:clear
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan config:clear
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan view:clear

# Optimizar aplicación
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan config:cache
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan route:cache
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan view:cache

# Crear enlace simbólico para storage
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan storage:link

# Ejecutar tareas programadas
docker-compose -f docker-compose-perneria-simple.yml exec app php artisan schedule:run
```

## Volúmenes y Persistencia

### Volúmenes de Datos
- `perneria_dbdata` - Datos de MySQL

### Backup de Base de Datos
```bash
# Crear backup
docker-compose -f docker-compose-perneria-simple.yml exec db mysqldump -u root -proot perneria_aqui_me_quedo > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose -f docker-compose-perneria-simple.yml exec -T db mysql -u root -proot perneria_aqui_me_quedo < backup_file.sql
```

## Solución de Problemas

### Problemas Comunes

1. **Puertos en uso**
   ```bash
   # Verificar puertos ocupados
   lsof -i :8002
   lsof -i :3308
   ```

2. **Permisos de archivos**
   ```bash
   # Corregir permisos
   docker-compose -f docker-compose-perneria-simple.yml exec app chmod -R 777 /var/www/html/storage
   docker-compose -f docker-compose-perneria-simple.yml exec app chmod -R 777 /var/www/html/bootstrap/cache
   ```

3. **Reiniciar servicios**
   ```bash
   # Reiniciar aplicación
   docker-compose -f docker-compose-perneria-simple.yml restart app
   
   # Reiniciar base de datos
   docker-compose -f docker-compose-perneria-simple.yml restart db
   ```

### Logs de Depuración
```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose-perneria-simple.yml logs

# Ver logs de un servicio específico
docker-compose -f docker-compose-perneria-simple.yml logs app
docker-compose -f docker-compose-perneria-simple.yml logs db
```

## Desarrollo

### Estructura de Archivos Docker
```
├── docker-compose-perneria-simple.yml    # Configuración de servicios
└── docker-start-perneria-simple.sh       # Script de inicio automático
```

### Personalización

#### Cambiar Puertos
Editar `docker-compose-perneria-simple.yml`:
```yaml
ports:
  - "8002:80"      # Puerto de la aplicación
  - "3308:3306"    # Puerto de MySQL
```

#### Cambiar Credenciales
Editar `docker-compose-perneria-simple.yml`:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: tu_password
  MYSQL_USER: tu_usuario
  MYSQL_PASSWORD: tu_password
```

## Ventajas de la Versión Simple

- ✅ **Menos recursos**: Solo 2 contenedores en lugar de 4
- ✅ **Configuración más simple**: Fácil de entender y mantener
- ✅ **Menos dependencias**: No requiere PHPMyAdmin ni Redis
- ✅ **Más rápido**: Inicio más rápido de los servicios
- ✅ **Menos complejidad**: Ideal para desarrollo y pruebas

## Diferencias con la Versión Completa

| Característica | Versión Simple | Versión Completa |
|----------------|----------------|------------------|
| Contenedores | 2 (app + db) | 4 (app + db + phpmyadmin + redis) |
| Puertos | 8002, 3308 | 8002, 8081, 3308, 6380 |
| Recursos | Menos | Más |
| Complejidad | Baja | Media |
| Uso recomendado | Desarrollo/Pruebas | Producción |

---

**Docker Simple configurado para Perneria Aqui me quedo** 🐳🏪
