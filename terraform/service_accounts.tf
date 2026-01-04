resource "google_service_account" "cloud_run" {
  account_id   = "bow-cloud-run"
  display_name = "Cloud Run Service Account"
}
