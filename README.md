# memories-api

    HTTP and WebSocket endpoints for the `memories-io` web application.

## Table of Contents

    - [Overview](#overview)
    - [CI-CD principles](#ci-cd-principles)
    - [Integration](#integration)
    - [Installation](#installation)
    - [Troubleshooting](#troubleshooting)
    - [Routes](#routes)
    - [Run] (#run)

## Overview

    `memories-api` is a backend API built using Node.js and follows a hexagonal architecture. It serves both HTTP and WebSocket connections via `socket.io` and RESTful endpoints.

    Once deployed in production, Nginx is used as a reverse proxy to deal with SSL certificates.
    PM2 is used to runs the application in the background (automatically restarts it if it crashes, and ensures it stays online). It is configured with ecosystem.config.js file.

    ( [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.)

## CI-CD principles

### Integration

    Environment variables & secrets
    - All variables and secrets are stored in the Git environments manager of the repository.
    - They will be injected by Git in a `.env` file nammed  .<`NODE_ENV`>.env,  in the `./config/` folder, by git action during deployement.
    - For local development, testing, or any purpose, you can direclty create your onw file in this `./config/` folder with the appropriate name.

    Tests/Lints
    - (pre commit) Hushy to setup...
    - (Post push) Git action to setup...

### Deployment

    - Through ssh connection, a Git action is in charge of pulling the code from the git repository to the cloud server. After injecting variables ans secrets it installs dependencies and start.
    - Then we let PM2 do the rest.

## Installation

### Local

1. **_Clone the repository:_**
   ```sh
   git clone https://github.com/wynsmic/memories-api.git
   cd memories-api
   ```
2. **_Install dependencies:_**
   ```sh
   npm install
   ```
3. **_Run the application locally:_**
   ```sh
   npm run server:dev
   ```

### AWS deployement setup

1. **SSH keys**
   - Create a key:
   ```sh
       ssh-keygen -t ed25519 -C "git-aws-key"
   ```
2. **Main steps to configure an AWS instance**

   - Create a AWS account (with a lightsail instance for exemple)
   - Add it the public key created previously
   - Create static IP
   - Make sure that TCP ports 443 and 80 are opened.

3. **Get a domain (optional)**
   Get the SSL certificate
   Setup the dns to forward to the static IP, in proxy mode.

   Comme back to you aws instance and add the certificates:
   certificate goes into `/etc/ssl/certs/cloudflare.pem`
   certificate_key goes into `/etc/ssl/private/cloudflare.key`
   (accordingly to the nginx.conf)

4. **Git env**
   Add the private key to the Git env secrets (so that Git actions can ssh into AWS and achive deployment).

   If the repository is private,
   Add the public part to the Git deploy keys (so that AWS can clone the project)
   Then on you AWS instance, to avoid "Host key verification failed" when cloning the repo.

   ```sh
   ssh-keyscan github.com >> ~/.ssh/known_hosts
   ```

   (this will prevents SSH from asking whether to trust GitHub during teh deployement)

5. **Ensure correct permissions for Nginx config:**

   ```sh
   sudo chown -R <user>:<user> /etc/nginx
   ```

6. **SSL Setup (Alternative to domain provider's certificate)**
   Install Certbot:

   ```sh
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

   Obtain an SSL certificate:

   ```sh
   sudo certbot --nginx -d <your-public-IP>
   ```

   It will get a certificate and have Certbot edit your nginx configuration automatically to serve it (with automatic renewal).

7. **Test the Nginx configuration**
   ```sh
   sudo nginx -t
   ```

## Troubleshooting

1. **Whitelist your domain provider's IPs (if needed):**

   ```sh
   sudo ufw allow from 173.245.48.0/20
   sudo ufw allow from 103.21.244.0/22
   ...
   ```

2. **Check Nginx binding:**

   ```sh
   sudo ss -tulnp | grep nginx
   ```

   Ensure `listen 443 ssl http2;` is bound to `0.0.0.0:443`.

3. **Test SSL configuration:**

   ```sh
   openssl s_client -connect memories-api.com:443
   ```

4. **PM2 logs:**
   ```sh
   pm2 logs
   ```
5. **Nginx logs:**

   - Access logs: `/var/log/nginx/access.log`
   - Error logs: `/var/log/nginx/error.log`

6. **Backend logs:**
   - Errors: `~/.pm2/logs/backend-error.log`
   - Standard logs: `~/.pm2/logs/backend-out.log`

## Routes

### Health check

    A health check can be performed by calling:
    ```sh
    curl -v https://memories-api.com/hb
    ```
    The `/hb` endpoint should return a successful response if the API is running correctly.

## Run

### COmpile and run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Tech notes

## Prisma

To generate the migraton file from the prisma.schema run:

```bash
env $(cat config/.development.env | xargs) npx prisma migrate dev --name init
```

For production, use:

```bash
npx prisma migrate deploy
```
