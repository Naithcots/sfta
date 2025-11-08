# 🗂️ Simple File Transfer API (SFTA)

A lightweight file upload API built with Fastify and TypeScript - ideal for small projects, testing environments or self-hosted setups.

## ✨ Features

- Single file upload endpoint
- Protection via a custom `x-api-key` header
- Configurable upload path and file size limit
- Serve app using your preferred web server (e.g. Nginx)
- Simple Docker deployment

## ⚙️ Installation

1. **Rename `.env.example` file to `.env` and configure variables:**

   ```yaml
    # Do not touch!
    NODE_ENV = production

    # Node.js version used by the container
    NODE_VERSION = 24-slim

    # Generate a new key with `openssl rand -hex 64`
    API_KEY = 

    # Maximum file size for a single file in bytes (default: 10MB)
    FILE_SIZE_LIMIT = 1e+7 

    # Local filesystem directory to store uploaded files
    # The container requires read/write access to this directory
    UPLOADS_DIR = /var/www/sfta/uploads

    # Exposed HTTP host port
    HTTP_HOST_PORT = 8080
   ```

2. **Set up host web server:**

    Additional host web server configuration is required. The container exposes single host port for a web server to handle HTTP requests.

    ```conf
    # Example host nginx configuration
    # /etc/nginx/sites-enabled/sfta

    server {
        listen 80;
        server_name <your-domain>; # Replace with your domain
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name <your-domain>; # Replace with your domain

        # Quickly generate certificates with certbot or include wildcards:
        ssl_certificate /etc/letsencrypt/live/<your-domain>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<your-domain>/privkey.pem;

        location / {
            proxy_pass http://127.0.0.1:<HTTP_HOST_PORT>; # Replace with `HTTP_HOST_PORT` variable from .env file
            include proxy_params;
        }
    }
    ```

3. **Start the container:**

   ```bash
   sudo docker compose -f compose.yaml -f compose.prod.yaml up -d
   ```

## 📤 Usage

### Upload a file

```js
// A file <input> element
const avatar = document.querySelector('#avatar');

const formData = new FormData();
formData.append('file', avatar.files[0]);

const response = await fetch('https://example.com/upload', {
  method: 'POST',
  body: formData,
  headers: {
    'x-api-key': '<generated-api-key>',
  },
});

console.log(await response.json());
// { url: /uploads/<random-file-name>.jpg }
```

### Get an uploaded file

The uploaded file URL is returned only once (after upload).
You should **store it in the database** or other persistent storage.

```html
<!-- Image file example -->
<img src="https://example.com/uploads/<random-file-name>.jpg" alt="avatar" />
```

## ❓FAQ

- **Do you use it yourself?**
  - Yes - an instance of this app is running on my dedicated server as an alternative to cloud storage for development.
- **Should I use it?**
  - If you need a simple, self-hosted file upload API for development instead of cloud storage provider, this is a great fit.
- **Is it secure?**
  - Uploads are protected with a custom `x-api-key` header and served files are protected through obscurity, using a randomized file name. However, **do not use this in production** - it's best suited for development environments.

## 🧰 Tech Stack

- [Fastify](https://fastify.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Nginx](https://nginx.org/)
