# 🗂️ Simple File Transfer API (SFTA)

A lightweight file upload API built with Fastify and TypeScript - ideal for small projects, testing environments or self-hosted setups.

## ✨ Features

- Single file upload endpoint
- Protection via a custom `x-api-key` header
- Configurable upload path and file size limit
- Serve uploads using your preferred web server (e.g. Nginx)
- Simple Docker deployment

## ⚙️ Installation

### Using Docker

1. **Open the `docker-compose.yaml` and configure host port:**

   ```yaml
   ports:
     - '127.0.0.1:<custom-port>:80'
   ```

2. **Set the upload directory (host volume path):**

   ```yaml
   volumes:
     - '<custom-safe-file-system-path>:/app/uploads:rw'
   ```

   > The configured path must have **read permissions** for a web server user in order to find and serve uploaded files.

3. **Configure the environment variables:**

   ```yaml
   environment:
   API_KEY: <generated-api-key> # e.g. openssl rand -hex 64
   FILE_SIZE_LIMIT: <value-in-bytes> # e.g. 1e+7 (10MB)
   WEB_UPLOADS_URL: <web-server-uploads-location> # e.g. https://example.com/uploads
   ```

   > Other environment variables in this file are used internally by the container and can be ignored.

4. **Set up the web server**
   Example Nginx configuration:

   ```conf
   # /etc/nginx/sites-enabled/sfta

   server {
       listen 80;
       server_name <your-domain>; # Match with 'WEB_UPLOADS_URL' from step 3
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name <your-domain>; # Match with 'WEB_UPLOADS_URL' from step 3

       ssl_certificate /etc/letsencrypt/live/<your-domain>/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/<your-domain>/privkey.pem;

       location / {
           proxy_pass http://127.0.0.1:<custom-port>; # Match port from step 1
           include proxy_params;
       }


       location /uploads { # Match with 'WEB_UPLOADS_URL' from step 4
           alias <custom-safe-file-system-path>; # Match path from step 2
           autoindex off;
       }
   }
   ```

5. **Start the container:**

   ```bash
   sudo docker compose up -d
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
// { url: https://example.com/uploads/<random-file-name>.jpg }
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
