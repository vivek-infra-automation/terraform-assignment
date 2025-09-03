resource "aws_secretsmanager_secret" "db" {
  name        = "${var.project_name}-db-connection"
  description = "DB connection string"

  tags = {
    Name    = "${var.project_name}-db-secret"
    Project = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id     = aws_secretsmanager_secret.db.id
  secret_string = var.db_connection_string
}