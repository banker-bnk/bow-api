# Infrastructure Management and Deployment Guide

This document outlines the necessary steps to configure the Google Cloud Platform (GCP) environment, provision infrastructure using Terraform, and deploy the application via Docker and Cloud Run.

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured.
- [Terraform](https://www.terraform.io/downloads) installed.
- [Docker](https://docs.docker.com/get-docker/) installed and running.

---

## 1. GCP Authentication and Project Configuration

Authenticate with Google Cloud and set the target project and account context for the session.

```bash
# Login with application-default credentials
gcloud auth application-default login --disable-quota-project

# Set the active account
gcloud config set account carbonbaseddev@gmail.com

# Set the active project
gcloud config set project carbon-based-bow
```

---

## 2. Infrastructure Provisioning

### Initial Setup: API Activation
First, apply Terraform specifically to enable required Google Cloud APIs and services. This step ensures that subsequent resources have the necessary services available.

```bash
terraform apply \
  -target="google_project_service.run" \
  -target="google_project_service.artifactregistry" \
  -target="google_project_service.sqladmin" \
  -target="google_project_service.secretmanager" \
  -target="google_project_service.iam"
```

### Full Deployment
Once the APIs are active, proceed with the general Terraform application to provision the remaining resources, such as the database and networking components.

> **Note:** This process may take some time, particularly during the creation of the Cloud SQL database instance.

```bash
# Verify the execution plan
terraform plan -var-file=environment/development/variables.tfvars

# Apply the changes
terraform apply -var-file=environment/development/variables.tfvars
```

---

## 3. Docker Image Deployment

### Docker Configuration
Ensure that the Docker daemon is running on your machine. Then, configure Docker to authenticate with the Google Artifact Registry.

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Build and Push Image
Build the Docker image and push it to the remote registry.

> **Important:** Run the following command from the **root directory** of the project (where the `Dockerfile` is located), not inside the `terraform` directory.

```bash
docker buildx build \
  --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/carbon-based-bow/containers/bow-api:latest \
  --push .
```

### Update Cloud Run Service
Finally, update the Cloud Run service to deploy the newly pushed image.

```bash
gcloud run services update bow-api \
  --image us-central1-docker.pkg.dev/carbon-based-bow/containers/bow-api:latest \
  --region us-central1
```
