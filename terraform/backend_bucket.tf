resource "google_storage_bucket" "default" {
  name          = "tf-state-carbon-based-bow"
  location      = var.gcp_region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}
