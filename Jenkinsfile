def runCommand(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(
      name: 'DEPLOY_WITH_DOCKER',
      defaultValue: false,
      description: 'Run docker compose after build. Requires Jenkins credential beatrix-backend-env.'
    )
    booleanParam(
      name: 'ENABLE_NGROK',
      defaultValue: false,
      description: 'Expose the frontend through ngrok during deploy. Requires Jenkins credential beatrix-ngrok-authtoken.'
    )
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Backend') {
      steps {
        dir('backend') {
          script {
            runCommand('npm ci')
          }
        }
      }
    }

    stage('Check Backend Syntax') {
      steps {
        dir('backend') {
          script {
            runCommand('node --check src/server.js')
          }
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          script {
            runCommand('npm ci')
            runCommand('npm run build')
          }
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          runCommand('docker compose build')
        }
      }
    }

    stage('Deploy With Docker Compose') {
      when {
        expression { return params.DEPLOY_WITH_DOCKER }
      }
      steps {
        script {
          withCredentials([file(credentialsId: 'beatrix-backend-env', variable: 'BACKEND_ENV_FILE')]) {
            if (isUnix()) {
              sh 'cp "$BACKEND_ENV_FILE" backend/.env'
            } else {
              bat 'copy /Y "%BACKEND_ENV_FILE%" "backend\\.env"'
            }
          }

          if (params.ENABLE_NGROK) {
            withCredentials([string(credentialsId: 'beatrix-ngrok-authtoken', variable: 'NGROK_AUTHTOKEN')]) {
              runCommand('docker compose --profile tunnel up -d --build')
            }
          } else {
            runCommand('docker compose up -d --build backend frontend')
          }
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check the stage logs above.'
    }
  }
}
