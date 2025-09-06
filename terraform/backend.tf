terraform {
  backend "s3" {
    bucket = "amir-tfstates"
    key    = "terraform/state.tfstate"
    region = "eu-west-1"
  }
}
