pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'base-url', variable: 'BASE_URL'),
                    string(credentialsId: 'login-username', variable: 'LOGIN_USERNAME'),
                    string(credentialsId: 'login-password', variable: 'LOGIN_PASSWORD')
                ]) {
                    bat 'npx playwright test'
                }
            }
        }
    }
}