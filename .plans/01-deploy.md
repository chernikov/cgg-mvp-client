# Deployment Plan - Career Guidance Guild

## Overview
This plan outlines the deployment process for the CGG MVP application using Google Cloud Run with Firebase Hosting integration and GitHub Actions automation.

## Phase 1: Validate CloudRun Deployment Script

### 1.1 Update Home Page for Testing
- [ ] Add distinctive title/banner to home page for deployment verification
- [ ] Include build timestamp or version identifier
- [ ] Ensure changes are visible and easily identifiable on production

### 1.2 Manual CloudRun Deployment Test
- [ ] Run `./deploy-cloudrun.sh` script locally
- [ ] Verify Docker build process completes successfully
- [ ] Confirm Cloud Run service deployment
- [ ] Test Firebase Hosting integration
- [ ] Validate application loads at https://careergg.com/
- [ ] Verify new title/changes are visible on live site
- [ ] Test all major functionality (language switching, navigation, forms)

### 1.3 Deployment Validation Checklist
- [ ] Home page displays new title/banner correctly
- [ ] Multi-language support working (EN, UK, HI)
- [ ] All navigation links functional
- [ ] Student/Teacher/Parent flows accessible
- [ ] No hydration errors in browser console
- [ ] Mobile responsiveness maintained
- [ ] Performance metrics acceptable

## Phase 2: Restore GitHub Actions Workflow

### 2.1 Recover Previous Deploy Configuration
- [ ] Search git history for previous `.github/workflows/deploy.yml`
- [ ] Use `git log --oneline --grep="deploy"` to find deployment commits
- [ ] Use `git log --follow -- .github/workflows/` to track workflow changes
- [ ] Restore the most recent working version with `git checkout <commit> -- .github/workflows/deploy.yml`

### 2.2 Review and Update Workflow
- [ ] Verify workflow triggers (push to main/develop branches)
- [ ] Update any outdated action versions
- [ ] Ensure environment variables and secrets are configured
- [ ] Validate Node.js version matches current project requirements

## Phase 3: Integrate CloudRun Script with GitHub Actions

### 3.1 Modify deploy-cloudrun.sh for CI/CD
- [ ] Remove interactive authentication (`gcloud auth login`)
- [ ] Add service account authentication for GitHub Actions
- [ ] Configure environment variables for CI environment
- [ ] Add error handling and logging for automated execution
- [ ] Test script in headless/non-interactive mode

### 3.2 Update GitHub Actions Workflow
- [ ] Add Google Cloud SDK setup step
- [ ] Configure service account authentication
- [ ] Add required secrets to GitHub repository:
  - `GCP_SA_KEY` (Service Account JSON key)
  - `GCP_PROJECT_ID` (Project ID: cgg-v1)
  - Any Firebase tokens if needed
- [ ] Integrate deploy-cloudrun.sh execution
- [ ] Add deployment status notifications

### 3.3 Security and Best Practices
- [ ] Ensure service account has minimal required permissions
- [ ] Implement deployment approval process for production
- [ ] Add rollback mechanism in case of deployment failures
- [ ] Configure monitoring and alerting for deployments

## Phase 4: Testing and Validation

### 4.1 GitHub Actions Testing
- [ ] Create test branch with deployment changes
- [ ] Trigger workflow and monitor execution
- [ ] Verify each step completes successfully
- [ ] Validate deployed application functionality

### 4.2 Production Deployment
- [ ] Merge changes to main/production branch
- [ ] Monitor automated deployment process
- [ ] Verify https://careergg.com/ reflects latest changes
- [ ] Perform post-deployment testing

## Required Files and Components

### deploy-cloudrun.sh modifications needed:
```bash
# Remove: gcloud auth login
# Add: gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}
# Add: Better error handling and CI-friendly output
```

### GitHub Secrets to Configure:
- `GCP_SA_KEY`: Service account JSON key (base64 encoded)
- `GCP_PROJECT_ID`: cgg-v1
- `FIREBASE_TOKEN`: (if using Firebase CLI in CI)

### Workflow Steps Structure:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build application
5. Setup Google Cloud SDK
6. Authenticate with service account
7. Execute deploy-cloudrun.sh
8. Notify deployment status

## Success Criteria
- [ ] Manual CloudRun deployment successful
- [ ] Changes visible on https://careergg.com/
- [ ] GitHub Actions workflow restored and functional
- [ ] Automated deployment working end-to-end
- [ ] All application features working post-deployment
- [ ] Deployment process documented and repeatable

## Rollback Plan
- [ ] Keep previous working deployment available
- [ ] Document rollback commands for Cloud Run
- [ ] Maintain backup of working Firebase configuration
- [ ] Have manual deployment process as fallback

---

**Next Steps**: Begin with Phase 1 - Update home page and test manual deployment to validate the current CloudRun setup.