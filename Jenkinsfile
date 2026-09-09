pipeline {
    agent any

    tools {
        jdk 'JDK-21'
        maven 'Maven-3.9.16'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    bat 'mvn test'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying FoodLoop application...'
                bat 'echo FoodLoop deployment completed successfully!'
            }
        }
    }

    post {
        success {
            echo 'FoodLoop Pipeline completed successfully!'
        }

        failure {
            echo 'FoodLoop Pipeline failed!'
        }
    }
}