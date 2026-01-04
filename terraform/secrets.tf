resource "google_secret_manager_secret" "db_user" {
  secret_id = "db-user"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "db_name" {
  secret_id = "db-name"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_user" {
  secret      = google_secret_manager_secret.db_user.id
  secret_data = "bow_user"
}

resource "google_secret_manager_secret_version" "db_name" {
  secret      = google_secret_manager_secret.db_name.id
  secret_data = "bow_db"
}

resource "random_password" "db" {
  length           = 32
  special          = true
  override_special = "_%@"
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db.result
}
