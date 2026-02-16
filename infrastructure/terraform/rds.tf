# ============================================
# RDS PostgreSQL Database
# ============================================

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg-${var.environment}"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from ECS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg-${var.environment}"
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-${var.environment}"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-db-subnet-${var.environment}"
  }
}

# RDS Parameter Group
resource "aws_db_parameter_group" "postgres" {
  name   = "${var.project_name}-postgres15-${var.environment}"
  family = "postgres15"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_duration"
    value = "1"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  tags = {
    Name = "${var.project_name}-postgres-params-${var.environment}"
  }
}

# RDS Instance
resource "aws_db_instance" "postgres" {
  identifier     = "${var.project_name}-db-${var.environment}"
  engine         = "postgres"
  engine_version = "15.4"

  # Instance configuration
  instance_class        = var.environment == "production" ? "db.m5.large" : "db.t3.medium"
  allocated_storage     = 100
  max_allocated_storage = 500
  storage_type          = "gp3"
  storage_encrypted     = true

  # Database configuration
  db_name  = "starrynight"
  username = "starrynight_admin"
  password = var.db_password # Store in AWS Secrets Manager in production

  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = var.environment == "production" ? true : false

  # Backup configuration
  backup_retention_period = var.environment == "production" ? 14 : 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "mon:04:00-mon:05:00"
  skip_final_snapshot     = var.environment == "staging" ? true : false
  final_snapshot_identifier = var.environment == "production" ? "${var.project_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  # Performance and monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled    = var.environment == "production" ? true : false
  monitoring_interval             = var.environment == "production" ? 60 : 0
  monitoring_role_arn             = var.environment == "production" ? aws_iam_role.rds_monitoring[0].arn : null

  # Parameter group
  parameter_group_name = aws_db_parameter_group.postgres.name

  # Deletion protection
  deletion_protection = var.environment == "production" ? true : false

  tags = {
    Name = "${var.project_name}-postgres-${var.environment}"
  }
}

# Read Replica (Production only)
resource "aws_db_instance" "postgres_replica" {
  count              = var.environment == "production" ? 1 : 0
  identifier         = "${var.project_name}-db-replica-${var.environment}"
  replicate_source_db = aws_db_instance.postgres.identifier

  instance_class = "db.m5.large"
  
  publicly_accessible = false
  skip_final_snapshot = true

  # Performance monitoring
  performance_insights_enabled = true
  monitoring_interval          = 60
  monitoring_role_arn          = aws_iam_role.rds_monitoring[0].arn

  tags = {
    Name = "${var.project_name}-postgres-replica-${var.environment}"
  }
}

# IAM Role for Enhanced Monitoring
resource "aws_iam_role" "rds_monitoring" {
  count = var.environment == "production" ? 1 : 0
  name  = "${var.project_name}-rds-monitoring-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count      = var.environment == "production" ? 1 : 0
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ============================================
# Variables
# ============================================

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

# ============================================
# Outputs
# ============================================

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_replica_endpoint" {
  description = "RDS read replica endpoint"
  value       = var.environment == "production" ? aws_db_instance.postgres_replica[0].endpoint : null
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.postgres.db_name
}
