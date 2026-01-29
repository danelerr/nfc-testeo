# Guía de Despliegue - Kit Digital Horizontes Libres

## Pre-requisitos

Antes de comenzar el despliegue, asegúrate de tener:

- ✅ Node.js versión 16.0.0 o superior instalado
- ✅ npm o yarn como gestor de paquetes
- ✅ Git para control de versiones
- ✅ Acceso al servidor de producción
- ✅ Variables de entorno configuradas
- ✅ Base de datos configurada (si aplica)

## Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/danelerr/kit-digital.git
cd kit-digital
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Entorno
NODE_ENV=development

# Servidor
PORT=3000
HOST=localhost

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kit_digital
DB_USER=usuario
DB_PASSWORD=contraseña_segura

# Seguridad
JWT_SECRET=tu_clave_secreta_muy_segura
SESSION_SECRET=otra_clave_secreta

# APIs Externas
API_KEY=tu_api_key
```

### 4. Iniciar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Despliegue en Producción

### Opción 1: Despliegue Tradicional (VPS/Servidor)

#### 1. Preparar el Servidor

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2

# Instalar Nginx (opcional, para reverse proxy)
sudo apt install nginx -y
```

#### 2. Clonar y Configurar la Aplicación

```bash
# Clonar el repositorio
cd /var/www
git clone https://github.com/danelerr/kit-digital.git
cd kit-digital

# Instalar dependencias de producción
npm install --production

# Configurar variables de entorno
nano .env
```

#### 3. Configurar PM2

```bash
# Iniciar la aplicación con PM2
pm2 start src/index.js --name kit-digital

# Guardar la configuración de PM2
pm2 save

# Configurar PM2 para iniciar con el sistema
pm2 startup systemd
```

#### 4. Configurar Nginx (Opcional)

Crea un archivo de configuración en `/etc/nginx/sites-available/kit-digital`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/kit-digital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo systemctl enable certbot.timer
```

### Opción 2: Despliegue con Docker

#### 1. Crear Dockerfile

Crea un archivo `Dockerfile` en la raíz del proyecto:

```dockerfile
FROM node:16-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --production

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Usuario no root
USER node

# Comando de inicio
CMD ["node", "src/index.js"]
```

#### 2. Crear docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    networks:
      - kit-digital-network

networks:
  kit-digital-network:
    driver: bridge
```

#### 3. Construir y Ejecutar

```bash
# Construir la imagen
docker-compose build

# Iniciar los contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 3: Despliegue en Plataformas Cloud

#### Heroku

```bash
# Instalar Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login en Heroku
heroku login

# Crear aplicación
heroku create kit-digital-horizontes

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_clave_secreta

# Desplegar
git push heroku main

# Ver logs
heroku logs --tail
```

#### Vercel / Netlify

Para despliegue en Vercel o Netlify, consulta su documentación específica.

## Actualización de la Aplicación

### Actualización Manual

```bash
# En el servidor
cd /var/www/kit-digital

# Backup de la aplicación actual
cp -r . ../kit-digital-backup-$(date +%Y%m%d)

# Actualizar código
git pull origin main

# Instalar nuevas dependencias
npm install --production

# Reiniciar aplicación
pm2 restart kit-digital
```

### Actualización con Docker

```bash
# Pull últimos cambios
git pull origin main

# Reconstruir y reiniciar
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Verificación del Despliegue

### Checklist de Verificación

- [ ] La aplicación arranca sin errores
- [ ] Los endpoints responden correctamente
- [ ] Las variables de entorno están configuradas
- [ ] Los logs se están generando correctamente
- [ ] SSL está configurado (HTTPS)
- [ ] Backups automáticos configurados
- [ ] Monitorización activa
- [ ] Rendimiento aceptable

### Comandos de Verificación

```bash
# Verificar estado de PM2
pm2 status

# Verificar logs
pm2 logs kit-digital

# Verificar uso de recursos
pm2 monit

# Test de salud de la aplicación
curl http://localhost:3000/health
```

## Monitorización

### Con PM2

```bash
# Ver métricas en tiempo real
pm2 monit

# Ver logs
pm2 logs

# Ver información detallada
pm2 describe kit-digital
```

### Logs de Aplicación

Los logs se guardan en:
- `/var/log/kit-digital/app.log` (logs de aplicación)
- `/var/log/kit-digital/error.log` (logs de errores)

## Backups

### Backup Manual

```bash
# Backup de código
tar -czf backup-code-$(date +%Y%m%d).tar.gz /var/www/kit-digital

# Backup de base de datos (ejemplo PostgreSQL)
pg_dump -U usuario kit_digital > backup-db-$(date +%Y%m%d).sql
```

### Backup Automatizado

Crea un script de backup en `/usr/local/bin/backup-kit-digital.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/kit-digital"
DATE=$(date +%Y%m%d)

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Backup de código
tar -czf $BACKUP_DIR/code-$DATE.tar.gz /var/www/kit-digital

# Backup de base de datos
pg_dump -U usuario kit_digital > $BACKUP_DIR/db-$DATE.sql

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

Configura un cron job:

```bash
# Editar crontab
crontab -e

# Añadir backup diario a las 2 AM
0 2 * * * /usr/local/bin/backup-kit-digital.sh
```

## Troubleshooting

### Aplicación no Arranca

```bash
# Verificar logs
pm2 logs kit-digital --err

# Verificar puerto en uso
netstat -tulpn | grep 3000

# Verificar variables de entorno
pm2 env 0
```

### Alto Uso de CPU/Memoria

```bash
# Ver uso de recursos
pm2 monit

# Aumentar límite de memoria
pm2 restart kit-digital --max-memory-restart 500M
```

### Base de Datos no Conecta

```bash
# Verificar conectividad
telnet db-host 5432

# Verificar credenciales en .env
cat .env | grep DB_
```

## Rollback

En caso de problemas:

```bash
# Con Git
git revert HEAD
pm2 restart kit-digital

# Con Backup
cd /var/www
rm -rf kit-digital
cp -r kit-digital-backup-YYYYMMDD kit-digital
cd kit-digital
pm2 restart kit-digital
```

## Soporte

Para problemas o dudas:
- Consultar documentación: `/docs`
- Revisar issues en GitHub
- Contactar con el equipo de desarrollo

---

*Documento actualizado: Enero 2026*
