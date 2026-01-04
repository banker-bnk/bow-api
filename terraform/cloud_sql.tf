resource "google_sql_database_instance" "postgres" {
  name             = "bow-postgres"
  database_version = "POSTGRES_15"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"

    disk_size = 10
    disk_type = "PD_SSD"

    backup_configuration {
      enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "app_db" {
  name     = "bow_db"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "app_user" {
  name     = "bow_user"
  instance = google_sql_database_instance.postgres.name
  password = google_secret_manager_secret_version.db_password.secret_data
}