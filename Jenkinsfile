// Deklarasi variabel nodeVersionsOutput
def nodeVersionsOutput
pipeline {
    agent any

    tools {
        nodejs "NodeJS 18.18.0" // Nama NodeJS yang sudah diinstal di Jenkins
    }

    stages {
        stage("Notify Start") { // Notifikasi ke Telegram bahwa build dimulai
            steps {
                script {
                    sendMessageToTelegram("1")
                }
            }
        }

        stage("Build") { // Build aplikasi
            steps {
                sh "npm -v"
                sh "node -v"
                script {
                    // Inisialisasi variabel
                    nodeVersionsOutput = sh(script: "node versions.js", returnStdout: true).trim()
                    sh "npm install"
                    sh "tar -cvf ${nodeVersionsOutput}.tar *"
                }
                echo "BUILD SUCCESS LISTING FILES"
                sh "ls -al"
            }
        }

        stage("Deploy") { // Deploy aplikasi ke server FTP
            steps {
                script {
                    // Memastikan bahwa variabel nodeVersionsOutput telah diinisialisasi sebelum digunakan
                    if (nodeVersionsOutput) {
                        deployToSSH("Server Rabbit 01", "${nodeVersionsOutput}.tar", """
                            mkdir -p ${nodeVersionsOutput}
                            tar -xvf ${nodeVersionsOutput}.tar -C ${nodeVersionsOutput}
                            rm ${nodeVersionsOutput}.tar
                            mv ${nodeVersionsOutput} /var/www/NODE_PROD/
                            ./bash-scripts/manage-pm2.sh --filepath /var/www/NODE_PROD/${nodeVersionsOutput}/ecosystem.config.js --appname app
                            """)
                    } else {
                        error "Variabel nodeVersionsOutput not initialized!"
                    }
                }
            }
        }
    }

    post {
        failure { // Notifikasi ke Telegram jika build gagal
            script {
                sendMessageToTelegram("0")
            }
        }
        success { // Notifikasi ke Telegram jika build sukses
            script {
                sendMessageToTelegram("2")
            }
        }
    }
}

def deployToSSH(configName, sourceFiles, execCommand) {
    script {
        sshPublisher( // Step untuk menggunakan SSH Publisher
            failOnError: true, // Gagal jika ada kesalahan
            publishers: [
                sshPublisherDesc( // Deskripsi SSH Publisher
                    configName: configName, // Nama konfigurasi SSH di Jenkins
                    transfers: [
                        sshTransfer( // Transfer file menggunakan SSH
                            sourceFiles: sourceFiles, // Pola file yang akan ditransfer
                            execCommand: execCommand // Command yang akan dijalankan di server
                        )
                    ]
                )
            ]
        )
    }
}


def sendMessageToTelegram(messageCode) {
    // messageCode: 0 = Error, 1 = Start, 2 = Success
    def githubUrl = sh(script: 'git config --get remote.origin.url', returnStdout: true).trim() //Github url
    def commitHash = env.GIT_COMMIT //Git commit hash
    def lastCommitAuthor = sh(script: 'git log -1 --pretty=format:%an', returnStdout: true).trim() //Git commit author
    def branchName = scm.branches[0].name //Branch name
    def githubWithCommit = "${githubUrl}/commit/${commitHash}" //Github commit url
    def jobName = env.JOB_NAME // Job name
    def buildNumber = env.BUILD_NUMBER // Build number
    def jenkinsUrl = "https://jenkins.otoreply.com/" // Jenkins url
    def fullBlueOceanUrl = "${jenkinsUrl}blue/organizations/jenkins/${jobName}/detail/${jobName}/${buildNumber}/pipeline" // Blue Ocean url
    def group = "DEPLOYMENT"
    def senderBaseUrl = "http://192.168.56.1:3000/telemon"
    sh "curl -X GET \"${senderBaseUrl}?grup=${group}&msgCode=${messageCode}&jobName=${jobName}&buildNum=${buildNumber}&logsUrl=${fullBlueOceanUrl}&commitAuthor=${lastCommitAuthor}&commitUrl=${githubWithCommit}&branchName=${branchName}\""
}
