# GitHub Actions CI/CD Setup Guide

## Overview

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch

**Jobs:**
- **build-and-test**: 
  - Checkout code
  - Install dependencies
  - Build application
  - Upload build artifacts
  
- **deploy** (only on main branch):
  - Download build artifacts
  - Deploy to GitHub Pages

**Deployment:**
- Automatic deployment to GitHub Pages on every push to main
- Custom domain: `cic-bim-hub.vn`

### 2. Code Quality (`.github/workflows/code-quality.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests

**Checks:**
- TypeScript type checking
- Bundle size monitoring

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Custom domain: `cic-bim-hub.vn` (optional)

### 2. Configure Secrets (if needed)

For Vercel or other deployment targets:
```
Settings → Secrets and variables → Actions
```

Add secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 3. Branch Protection (Recommended)

Settings → Branches → Add rule:
- Require status checks before merging
- Require branches to be up to date
- Include `build-and-test` as required check

## Monitoring

### Build Status
Check workflow runs at:
```
https://github.com/anhnq-lab/cic-ttb-web/actions
```

### Bundle Size
Each PR shows bundle size in the summary

### Deployment Status
View deployments at:
```
https://github.com/anhnq-lab/cic-ttb-web/deployments
```

## Local Testing

Test the CI pipeline locally:
```bash
# Install act (GitHub Actions local runner)
# Windows: choco install act-cli
# Mac: brew install act

# Run CI locally
act push

# Run specific workflow
act -W .github/workflows/ci-cd.yml
```

## Troubleshooting

### Build fails on CI but works locally
- Check Node version (CI uses Node 18)
- Clear npm cache: `npm ci` instead of `npm install`
- Check environment variables

### Deployment fails
- Verify GitHub Pages is enabled
- Check `GITHUB_TOKEN` permissions
- Ensure `gh-pages` branch exists

## Next Steps

1. Add testing to pipeline (when tests are ready)
2. Add Sentry error reporting
3. Setup staging environment
4. Add performance budgets
