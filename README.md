# Hello World App - AWS ECS Deployment

A Node.js hello world application deployed on AWS ECS Fargate with Terraform.

## Architecture

- **ECS Fargate** - Containerized Node.js app
- **Application Load Balancer** - HTTPS endpoint
- **ECR** - Container registry
- **Secrets Manager** - Database connection string
- **VPC** - Private/public subnets across 2 AZs

## Prerequisites

- AWS CLI configured
- Docker installed
- Terraform >= 1.5.0
- Node.js 18+

## Setup Instructions

### 1. Create AWS Resources

```bash
# Create S3 bucket for Terraform state
aws s3 mb s3://terraform-state-bucket-hello-world --region us-west-2

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-west-2

# Create Secrets Manager secret
aws secretsmanager create-secret \
  --name "prod/db/connection" \
  --secret-string "postgresql://user:password@host:5432/db" \
  --region us-west-2
```

### 2. Deploy Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 3. Build and Push Container

```bash
# Get ECR login
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Build and push
docker build -t hello-world .
docker tag hello-world-app:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/hello-world:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/hello-world:latest
```

### 4. Update ECS Service

```bash
terraform apply -var="image_tag=latest"
```

## GitHub Actions Setup

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Push to `main` branch triggers:
1. Build and push Docker image to ECR
2. Deploy infrastructure with new image

## Testing

```bash
# Get ALB DNS name
terraform output alb_dns_name

# Test endpoint
curl -k https://<alb-dns-name>
```

Expected response: `Hello World!`

## Deployed Service URL

🌐 **Production URL**: `https://hello-world-app-alb-123456789.us-west-2.elb.amazonaws.com`

> Note: Replace with actual ALB DNS name from `terraform output alb_dns_name`

## Cleanup

```bash
terraform destroy
aws s3 rb s3://terraform-state-bucket-hello-world --force
aws dynamodb delete-table --table-name terraform-state-lock --region us-west-2
```