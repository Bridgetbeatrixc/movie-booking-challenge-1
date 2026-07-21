pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
    timestamps()
  }

  environment {
    REPOSITORY_URL = 'https://github.com/Bridgetbeatrixc/movie-booking-challenge-1.git'
    REPOSITORY_BRANCH = 'main'
    GIT_CREDENTIALS_ID = 'github-pat'
  }

  stages {
    stage('Checkout') {
      steps {
        // Explicit git checkout works in a standalone Pipeline job.
        git branch: env.REPOSITORY_BRANCH,
            credentialsId: env.GIT_CREDENTIALS_ID,
            url: env.REPOSITORY_URL
      }
    }

    stage('Validate Docker') {
      steps {
        // Jenkins is running on Windows, so use bat rather than sh.
        bat 'docker compose config'
      }
    }

    stage('Build Image') {
      steps {
        bat 'docker compose build'
      }
    }

    stage('Deploy') {
      steps {
        bat 'docker compose up -d'
        bat 'docker compose ps'
      }
    }
  }

  post {
    always {
      // Keep diagnostics Windows-compatible as well.
      bat 'docker compose ps'
    }
  }
}

