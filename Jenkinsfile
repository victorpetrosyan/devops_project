pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io/victorpetrosyan"
        BACKEND_IMAGE = "${REGISTRY}/devops-shop-backend:latest"
        FRONTEND_IMAGE = "${REGISTRY}/devops-shop-frontend:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE} ./backend'
                sh 'docker build -t ${FRONTEND_IMAGE} ./frontend'
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([string(credentialsId: 'ghcr-token', variable: 'GHCR_TOKEN')]) {
                    sh 'echo $GHCR_TOKEN | docker login ghcr.io -u victorpetrosyan --password-stdin'
                    sh 'docker push ${BACKEND_IMAGE}'
                    sh 'docker push ${FRONTEND_IMAGE}'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'k8s-token']) {
                    sh 'kubectl rollout restart deployment/backend -n shop'
                    sh 'kubectl rollout restart deployment/frontend -n shop'
                    sh 'kubectl rollout status deployment/backend -n shop'
                    sh 'kubectl rollout status deployment/frontend -n shop'
                }
            }
        }

    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
