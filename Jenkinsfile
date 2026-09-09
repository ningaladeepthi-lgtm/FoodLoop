
pipeline {
    agent any

    tools {
	jdk 'JDK-21'
        maven 'Maven-3.9.16'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out FoodLoop source code...'
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                echo 'Building Spring Boot backend...'
                dir('backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Backend Test') {
            steps {
                echo 'Running backend tests...'
                dir('backend') {
                    bat 'mvn test'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                echo 'Installing frontend dependencies...'
                dir('frontend') {
                    bat 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Building React frontend...'
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo 'FoodLoop Pipeline completed successfully!'
        }

        failure {
            echo 'FoodLoop Pipeline failed.'
        }
    }
}