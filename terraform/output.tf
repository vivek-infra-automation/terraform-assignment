output "alb_dns" {
  description = "ALB DNS name"
  value       = aws_lb.app.dns_name
}


output "ecr_repo" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.app.repository_url
}


output "ecs_cluster" {
  description = "ECS cluster ID"
  value       = aws_ecs_cluster.this.id
}