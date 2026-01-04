variable "gcp_project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "gcp_region" {
  type        = string
  default     = "us-central1"
  description = "GCP Region"
}

variable "docker_image_url" {
  type        = string
  description = "Docker image URL"
}
