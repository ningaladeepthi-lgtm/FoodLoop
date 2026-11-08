
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

        stage('Docker Connectivity Test') {
            steps {
                echo 'Checking Docker access from Jenkins...'

                bat 'whoami'
                bat 'if exist "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" (echo Chrome found for Jenkins) else (echo Chrome not found for Jenkins & exit /b 1)'

                bat '"C:\\Users\\deepthi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" version'

                bat '"C:\\Users\\deepthi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker-compose.exe" version'
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

        stage('Nuclei Security Scan') {
            steps {
                echo 'Starting Nuclei security scan on FoodLoop...'
                bat 'powershell.exe -NoProfile -ExecutionPolicy Bypass -File nuclei-scan.ps1'
            }
            post {
                always {
                    archiveArtifacts(
                        artifacts: 'nuclei-results.txt,nuclei-preview.log,nuclei-preview-error.log',
                        allowEmptyArchive: true
                    )
                }
            }
        }

        stage('Docker Deployment') {
            steps {
                echo 'Building and deploying FoodLoop using Docker Compose...'

                bat '"C:\\Users\\deepthi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker-compose.exe" -f docker-compose.yml up -d --build'

                echo 'Checking deployed Docker containers...'

                bat '"C:\\Users\\deepthi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" ps'
            }
        }

        stage('Application Readiness Check') {
            steps {
                echo 'Waiting for FoodLoop frontend to become ready...'

                bat 'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference=''Stop''; for ($i=0; $i -lt 30; $i++) { try { $response = Invoke-WebRequest -Uri ''http://localhost:3000'' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host ''FoodLoop is ready''; exit 0 } } catch { Start-Sleep -Seconds 2 } }; throw ''FoodLoop did not become ready within 60 seconds''"'
            }
        }

        stage('Selenium Automation Tests') {
            steps {
                echo 'Running four FoodLoop Selenium tests in headless Chrome...'

                bat 'mvn -f selenium-tests\\pom.xml test "-Dselenium.headless=true"'
            }

            post {
                always {
                    junit(
                        testResults: 'selenium-tests/target/surefire-reports/TEST-*.xml',
                        allowEmptyResults: true
                    )

                    archiveArtifacts(
                        artifacts: 'selenium-tests/pom.xml,selenium-tests/src/test/java/**/*.java,selenium-tests/target/surefire-reports/**',
                        allowEmptyArchive: true
                    )
                }
            }
        }
    }

    post {
        success {
            echo 'FoodLoop Pipeline completed successfully!'
        }

        failure {
            echo 'FoodLoop Pipeline failed. Check the failed stage logs.'
        }
    }
}
