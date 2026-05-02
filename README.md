# Scalable Image Upload Server (No Database)

## Overview

This project implements a scalable backend system for uploading images using multiple server instances and load balancing. The system is designed without any database and focuses on system architecture, infrastructure, and CI integration.

Images are uploaded, validated, optionally processed, and stored in AWS S3. Requests are distributed across multiple backend instances using NGINX.

---

## Features

* REST API for image upload
* File validation (JPG/PNG only, max 2MB)
* Upload images to AWS S3
* Unique file naming using timestamp + UUID
* Multiple backend server instances
* Load balancing using NGINX (round-robin)
* CI pipeline using GitHub Actions

---

## Tech Stack

* Node.js (Express)
* AWS S3
* NGINX
* GitHub Actions

---

## API Endpoint

### POST /upload

### Request

* Content-Type: multipart/form-data
* Field: `image` (JPG/PNG, max 2MB)

### Response

```json
{
  "url": "https://bucket-name.s3.amazonaws.com/image-name.jpg"
}
```

---

## Project Structure

```
image-upload-server/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env (not included in repo)
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Setup Instructions

### 1. Clone repository

```
git clone <your-repo-url>
cd image-upload-server
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in root:

```
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
```

---

### 4. Run multiple backend instances

Open two terminals:

Terminal 1:

```
$env:PORT=3001; node server.js
```

Terminal 2:

```
$env:PORT=3002; node server.js
```

---

### 5. Configure NGINX

Update your `nginx.conf`:

```
upstream backend {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 8080;

    location / {
        proxy_pass http://backend;
    }
}
```

Restart NGINX:

```
nginx -s stop
nginx
```

---

### 6. Test the API

Send POST request using Postman or curl:

```
http://localhost:8080/upload
```

Body:

* form-data
* key: image (file)

---

## Testing

* Uploaded multiple images using Postman
* Verified successful uploads to AWS S3
* Verified load balancing through logs:

```
Handled by PORT 3001
Handled by PORT 3002
Handled by PORT 3001
Handled by PORT 3002
```

---

## CI Pipeline (GitHub Actions)

* Runs on push and pull requests
* Installs dependencies
* Verifies server loads successfully

Workflow file:

```
.github/workflows/ci.yml
```

---

## Constraints Followed

* No database used
* No authentication implemented
* Focused on system flow and infrastructure
* Stateless architecture

---

## Conclusion

This project demonstrates a scalable backend architecture using load balancing and cloud storage. It ensures efficient handling of requests without relying on a database, while maintaining simplicity and scalability.
