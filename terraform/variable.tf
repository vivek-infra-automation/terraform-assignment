variable "project_name" {
  type        = string
  description = "Project name"
  default     = "hello-world-app"
}

variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-west-2"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "Public subnet CIDRs"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "Private subnet CIDRs"
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "alb_domain" {
  type        = string
  description = "ALB domain"
  default     = "example.com"
}

variable "container_port" {
  type        = number
  description = "Container port"
  default     = 3000
}

variable "desired_count" {
  type        = number
  description = "ECS task count"
  default     = 1
}

variable "cpu" {
  type        = string
  description = "Task CPU"
  default     = "256"
}

variable "memory" {
  type        = string
  description = "Task memory"
  default     = "512"
}

variable "db_secret_name" {
  type        = string
  description = "Secrets Manager secret name"
  default     = "prod/db/connection"
}

variable "image_tag" {
  type        = string
  description = "Docker image tag"
  default     = "latest"
}