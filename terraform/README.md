# Terraform: ECS Fargate Hello World (complete)


This project provisions:
- VPC (public + private subnets)
- ECR repository
- IAM roles for ECS
- ECS Fargate Cluster, Task, and Service
- ALB with HTTPS (uses locally-generated self-signed cert uploaded to ACM)
- Secrets Manager secret for DB connection string
- CloudWatch alarm on ECS CPU


## Quickstart
1. Create S3 bucket and DynamoDB table for remote state (or provide existing names).
2. Set `remote_state_bucket` and `remote_state_lock_table` variables (via `terraform.tfvars` or environment variables).
3. Set `db_connection_string` in `terraform.tfvars` (sensitive).
4. Initialize and apply:
```bash
terraform init
terraform apply -auto-approve
```


## Notes / Best practices
- Replace the self-signed certificate flow with ACM issued cert (via DNS) for production.
- Use least-privilege IAM and tighten policies further (e.g., restrict secrets access by ARN + conditions).
- Consider setting `image_tag` built by CI and passing it to task definition to ensure immutable deployments.

