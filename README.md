# AstroPaper With Directus

Base on [AstroPaper](https://github.com/satnaing/astro-paper)

## Dev

```bash

# Get Directus Starter for Backend
git clone https://github.com/seadfeng/headless-directus-starter.git && mv headless-directus-starter backend && mv backend/.env.example backend/.env

# Reset proxy if you need
source .bashrc

# dev
mv .env.example .env
pnpm develop

```

## Deploy

### Github Actions

#### Actions secrets and variables

**variables**:

- VITE_ASTRO_URL
- VITE_ASTRO_AUTHOR
- VITE_ASTRO_PROFILE
- VITE_DIRECTUS_URL

![Repository Variables](public/assets/repository-variables.png)

**secrets**

- CLOUDFLARE_ACCOUNT_ID
- CLOUDFLARE_API_TOKEN
- VITE_DIRECTUS_ADMIN_TOKEN

![Repository Secrets](public/assets/repository-secrets.png)

## Dependencies

- [headless-directus-starter](https://github.com/seadfeng/headless-directus-starter.git)
