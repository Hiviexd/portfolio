# Deployment Guide

This guide covers deploying the portfolio: **GitHub Pages** (static, recommended) or **VPS** (Node/PM2).

---

## GitHub Pages (static)

The site is built as a static export and deployed to **https://hivie.tn** via the workflow `.github/workflows/deploy-github-pages.yml`.

### One-time setup

1. In the repo: **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Under **Custom domain**, enter `hivie.tn` and save (GitHub will show DNS instructions)
4. At your domain registrar, add the DNS record GitHub shows:
   - **A records** for apex `hivie.tn`: point to GitHub’s IPs (e.g. `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or
   - **CNAME** for `www` (e.g. `www.hivie.tn` → `owner.github.io`) if you use www
5. (Optional) Enable **Enforce HTTPS** once DNS has propagated
6. (Optional) To skip deploy on a push, include `--skip-deploy` in the commit message

### What runs

- On push to `main` (or manual run): build runs with `BASE=/` for the custom domain, a `CNAME` file is written so GitHub serves hivie.tn, then `.output/public` is uploaded and published

### Manual deploy

**Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

---

## VPS deployment

This section explains how to deploy the portfolio application to a VPS using GitHub Actions (Node server; use only if you are not using GitHub Pages).

## Prerequisites

1. A VPS with:
   - Node.js 20+ installed (will be installed automatically if missing)
   - pnpm installed (will be installed automatically if missing)
   - PM2 installed globally (will be installed automatically if missing)
   - Git installed
   - SSH access configured
   - Repository cloned to `~/projects/portfolio`

2. GitHub repository with the following secrets configured:
   - `SERVER_HOST`: Your VPS IP address or domain
   - `SERVER_USER`: SSH username (e.g., `root` or `deploy`)
   - `SERVER_SSH_KEY`: Private SSH key for authentication
   - `DISCORD_WEBHOOK`: Discord webhook URL for notifications (optional)

## Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each secret:
   - `SERVER_HOST`: e.g., `192.168.1.100` or `example.com`
   - `SERVER_USER`: e.g., `root` or `deploy`
   - `SERVER_SSH_KEY`: Your private SSH key (the entire content of `~/.ssh/id_rsa` or similar)
   - `DISCORD_WEBHOOK`: Discord webhook URL for deployment notifications (optional)

### Generating SSH Key (if needed)

If you don't have an SSH key pair:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy"
```

Copy the public key to your VPS:
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your-vps-ip
```

Then add the private key content to GitHub secrets.

## VPS Setup

### 1. Install Node.js and pnpm

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2
```

### 2. Create deployment directory

```bash
# Create projects directory
mkdir -p ~/projects/portfolio
cd ~/projects/portfolio

# Create logs directory for PM2
mkdir -p logs
```

**Note**: The repository doesn't need to be cloned on the VPS since the built files are uploaded directly from GitHub Actions.

### 3. Configure Nginx (optional but recommended)

1. Copy `nginx.example.conf` to your nginx sites-available:
   ```bash
   sudo cp nginx.example.conf /etc/nginx/sites-available/portfolio
   ```

2. Edit the configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   ```
   - Update `server_name` with your domain
   - Adjust paths if needed

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 4. Set up SSL with Let's Encrypt (optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Deployment

The deployment workflow builds the project on GitHub Actions and then uploads the built output to your VPS. This approach:
- Ensures consistent build environment
- Reduces build time on VPS
- Only requires production dependencies on the VPS

### Automatic Deployment

The workflow automatically triggers on push to `main` branch. You can skip deployment by adding `--skip-deploy` to your commit message.

### Manual Deployment

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Select **Deploy to Production** workflow
4. Click **Run workflow**
5. Optionally provide a reason for the deployment
6. Click **Run workflow**

### Skipping Deployment

To skip automatic deployment, include `--skip-deploy` in your commit message:
```bash
git commit -m "Update README --skip-deploy"
```

### Deployment Process

1. **Build on GitHub Actions**: The project is built using pnpm in the GitHub Actions runner
2. **Package artifacts**: Built output (`.output`), `public` folder, `package.json`, `pnpm-lock.yaml`, and `ecosystem.config.cjs` are packaged
3. **Upload to VPS**: Files are uploaded to `~/projects/portfolio` on your VPS
4. **Install dependencies**: Production dependencies are installed on the VPS
5. **Restart service**: PM2 reloads the application

## Post-Deployment

After deployment, verify the application is running:

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs portfolio

# Monitor in real-time
pm2 monit
```

## Troubleshooting

### PM2 not found error

Install PM2 on your VPS:
```bash
npm install -g pm2
```

### Permission denied errors

Ensure the deployment user has write permissions:
```bash
sudo chown -R $USER:$USER ~/projects/portfolio
```

### Build failures

If the build fails on GitHub Actions, check:
- Build logs in the GitHub Actions tab
- Ensure all dependencies are correctly specified in `package.json`
- Verify the build command works locally: `pnpm build`

### Application not starting

Check PM2 logs:
```bash
pm2 logs portfolio --lines 50
```

### Port already in use

Change the port in `ecosystem.config.cjs` or stop the conflicting service.

## Updating the Deployment

To update deployment settings, modify:
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `ecosystem.config.cjs` - PM2 configuration
- `nginx.example.conf` - Nginx configuration (if using)

After making changes, commit and push to trigger a new deployment.
