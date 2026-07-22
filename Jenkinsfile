pipeline {
  agent any

  options {
    skipDefaultCheckout(true)
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        // Explicit git checkout works in a standalone Pipeline job.
        git branch: 'main',
            credentialsId: 'github-pat',
            url: 'https://github.com/Bridgetbeatrixc/movie-booking-challenge-1.git'
      }
    }

    stage('Validate Docker') {
      steps {
        // Jenkins is running on Windows, so use bat rather than sh.
        // This fails early with a clear message when Docker Desktop is unavailable.
        bat 'docker version'
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
      bat(returnStatus: true, script: 'docker compose ps')
    }
  }
}
