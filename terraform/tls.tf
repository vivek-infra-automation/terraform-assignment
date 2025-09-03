resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 2048
}


resource "tls_self_signed_cert" "example" {
  private_key_pem = tls_private_key.example.private_key_pem


  subject {
    common_name  = var.alb_domain
    organization = "example"
  }


  validity_period_hours = 8760
  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}



resource "aws_acm_certificate" "self_signed" {
  private_key      = tls_private_key.example.private_key_pem
  certificate_body = tls_self_signed_cert.example.cert_pem

  tags = {
    Name    = "${var.project_name}-cert"
    Project = var.project_name
  }
}