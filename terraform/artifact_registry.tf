resource "google_artifact_registry_repository" "docker_repo" {
  project       = var.gcp_project_id
  location      = var.gcp_region
  repository_id = "containers"
  description   = "Docker images"
  format        = "DOCKER"

  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "keep-last-5"
    action = "KEEP"

    most_recent_versions {
      keep_count = 5
    }
  }

  depends_on = [google_project_service.artifactregistry]
}

// TODO: Ideally this should be done with a service account instead of a user
resource "google_project_iam_member" "artifact_registry_writer" {
  project = var.gcp_project_id
  role    = "roles/artifactregistry.writer"
  member  = "user:carbonbaseddev@gmail.com"
}
