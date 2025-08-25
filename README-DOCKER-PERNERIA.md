# Docker para Perneria Aqui me quedo

## Descripción
Configuración Docker completa para el sistema de gestión "Perneria Aqui me quedo" con todos los servicios necesarios.

## Servicios Incluidos

### 🐳 Contenedores Principales

1. **app** - Aplicación Laravel (PHP 8.2 + Apache)
   - Puerto: 8002
   - Contenedor: perneria-app

2. **db** - Base de datos MySQL 8.0
   - Puerto: 3308
   - Contenedor: perneria-db
   - Base de datos: perneria_aqui_me_quedo

3. **phpmyadmin** - Administrador de base de datos
   - Puerto: 8081
   - Contenedor: perneria-phpmyadmin

4. **redis** - Cache y sesiones
   - Puerto: 6380
   - Contenedor: perneria-redis

## Instalación Rápida

### Opción 1: Script Automático (Recomendado)
```bash
# Dar permisos de ejecución
chmod +x docker-start-perneria.sh

# Ejecutar script de configuración
./docker-start-perneria.sh
```

### Opción 2: Comandos Manuales
```bash
# 1. Crear archivo .env
cp .env.example .env

# 2. Construir contenedores
docker-compose -f docker-compose-perneria.yml build --no-cache

# 3. Levantar servicios
docker-compose -f docker-compose-perneria.yml up -d

# 4. Generar clave de aplicación
docker-compose -f docker-compose-perneria.yml exec app php artisan key:generate

# 5. Ejecutar migraciones
docker-compose -f docker-compose-perneria.yml exec app php artisan migrate

# 6. Ejecutar seeders
docker-compose -f docker-compose-perneria.yml exec app php artisan db:seed

# 7. Optimizar aplicación
docker-compose -f docker-compose-perneria.yml exec app php artisan config:cache
docker-compose -f docker-compose-perneria.yml exec app php artisan route:cache
docker-compose -f docker-compose-perneria.yml exec app php artisan view:cache
```

## Acceso a los Servicios

### 🌐 Aplicación Web
- **URL**: http://localhost:8002
- **Credenciales**:
  - Email: admin@perneriaaquimequedo.com
  - Password: password

### 🗄️ PHPMyAdmin
- **URL**: http://localhost:8081
- **Credenciales**:
  - Usuario: root
  - Contraseña: root
  - Base de datos: perneria_aqui_me_quedo

### 🔴 Redis
- **Host**: localhost
- **Puerto**: 6380

## Comandos Útiles

### Gestión de Contenedores
```bash
# Ver logs de la aplicación
docker-compose -f docker-compose-perneria.yml logs -f app

# Ver logs de la base de datos
docker-compose -f docker-compose-perneria.yml logs -f db

# Entrar al contenedor de la aplicación
docker-compose -f docker-compose-perneria.yml exec app bash

# Entrar al contenedor de la base de datos
docker-compose -f docker-compose-perneria.yml exec db mysql -u root -p

# Detener todos los servicios
docker-compose -f docker-compose-perneria.yml down

# Levantar servicios en segundo plano
docker-compose -f docker-compose-perneria.yml up -d

# Reconstruir contenedores
docker-compose -f docker-compose-perneria.yml build --no-cache
```

### Comandos Laravel
```bash
# Ejecutar migraciones
docker-compose -f docker-compose-perneria.yml exec app php artisan migrate

# Ejecutar seeders
docker-compose -f docker-compose-perneria.yml exec app php artisan db:seed

# Limpiar cache
docker-compose -f docker-compose-perneria.yml exec app php artisan cache:clear
docker-compose -f docker-compose-perneria.yml exec app php artisan config:clear
docker-compose -f docker-compose-perneria.yml exec app php artisan view:clear

# Optimizar aplicación
docker-compose -f docker-compose-perneria.yml exec app php artisan config:cache
docker-compose -f docker-compose-perneria.yml exec app php artisan route:cache
docker-compose -f docker-compose-perneria.yml exec app php artisan view:cache

# Crear enlace simbólico para storage
docker-compose -f docker-compose-perneria.yml exec app php artisan storage:link

# Ejecutar tareas programadas
docker-compose -f docker-compose-perneria.yml exec app php artisan schedule:run
```

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

### Crear Base de Datos Manualmente
```sql
CREATE DATABASE perneria_aqui_me_quedo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Volúmenes y Persistencia

### Volúmenes de Datos
- `perneria_dbdata` - Datos de MySQL
- `perneria_redis_data` - Datos de Redis

### Backup de Base de Datos
```bash
# Crear backup
docker-compose -f docker-compose-perneria.yml exec db mysqldump -u root -proot perneria_aqui_me_quedo > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose -f docker-compose-perneria.yml exec -T db mysql -u root -proot perneria_aqui_me_quedo < backup_file.sql
```

## Solución de Problemas

### Problemas Comunes

1. **Puertos en uso**
   ```bash
   # Verificar puertos ocupados
   lsof -i :8002
   lsof -i :8081
   lsof -i :3308
   lsof -i :6380
   ```

2. **Permisos de archivos**
   ```bash
   # Corregir permisos
   docker-compose -f docker-compose-perneria.yml exec app chown -R www:www /var/www/storage
   docker-compose -f docker-compose-perneria.yml exec app chown -R www:www /var/www/bootstrap/cache
   ```

3. **Reiniciar servicios**
   ```bash
   # Reiniciar aplicación
   docker-compose -f docker-compose-perneria.yml restart app
   
   # Reiniciar base de datos
   docker-compose -f docker-compose-perneria.yml restart db
   ```

### Logs de Depuración
```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose-perneria.yml logs

# Ver logs de un servicio específico
docker-compose -f docker-compose-perneria.yml logs app
docker-compose -f docker-compose-perneria.yml logs db
docker-compose -f docker-compose-perneria.yml logs phpmyadmin
docker-compose -f docker-compose-perneria.yml logs redis
```

## Desarrollo

### Estructura de Archivos Docker
```
├── docker-compose-perneria.yml    # Configuración de servicios
├── Dockerfile-perneria            # Imagen de la aplicación
├── docker-start-perneria.sh       # Script de inicio automático
└── docker/
    └── supervisor/
        └── supervisord.conf       # Configuración de supervisor
```

### Personalización

#### Cambiar Puertos
Editar `docker-compose-perneria.yml`:
```yaml
ports:
  - "8002:80"      # Puerto de la aplicación
  - "8081:80"      # Puerto de PHPMyAdmin
  - "3308:3306"    # Puerto de MySQL
  - "6380:6379"    # Puerto de Redis
```

#### Cambiar Credenciales
Editar `docker-compose-perneria.yml`:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: tu_password
  MYSQL_USER: tu_usuario
  MYSQL_PASSWORD: tu_password
```

## Producción

### Configuración para Producción
1. Cambiar `APP_ENV=production` en `.env`
2. Configurar `APP_DEBUG=false`
3. Usar variables de entorno seguras
4. Configurar SSL/TLS
5. Configurar backup automático

### Monitoreo
```bash
# Ver uso de recursos
docker stats

# Ver contenedores activos
docker ps

# Ver imágenes
docker images
```

---

**Docker configurado para Perneria Aqui me quedo** 🐳🏪
