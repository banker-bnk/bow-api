terraform {
  required_version = ">= 1.14.2"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.10.0"
    }
  }

  backend "gcs" {
    bucket = "tf-state-carbon-based-bow"
    prefix = "terraform/state"
  }
}
