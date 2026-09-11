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
                    string(credentialsId: 'BASE_URL', variable: 'BASE_URL'),
                    string(credentialsId: 'LOGIN_USERNAME', variable: 'LOGIN_USERNAME'),
                    string(credentialsId: 'LOGIN_PASSWORD', variable: 'LOGIN_PASSWORD')
                ]) {
                    bat 'npx playwright test'
                }
            }
        }
    }
}