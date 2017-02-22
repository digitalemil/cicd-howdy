def gitCommit() {
        sh "git rev-parse HEAD > GIT_COMMIT"
        def gitCommit = readFile('GIT_COMMIT').trim()
        sh "rm -f GIT_COMMIT"
        return gitCommit
    }

    node {
        // Checkout source code from Git
        stage 'Checkout'
        checkout scm

        // Build Docker image
        stage 'Build'
        sh "docker build -t gitlab.marathon.l4lb.thisdcos.directory:50000/root/howdy:${gitCommit()} ."

        // Log in and push image to GitLab
        stage 'Publish'
        withCredentials(
            [[
                $class: 'UsernamePasswordMultiBinding',
                credentialsId: 'gitlab',
                passwordVariable: 'GITLAB_PASSWORD',
                usernameVariable: 'GITLAB_USERNAME'
            ]]
        ) {
            sh "docker login -u ${env.GITLAB_USERNAME} -p ${env.GITLAB_PASSWORD}  gitlab.marathon.l4lb.thisdcos.directory:50000"
            sh "docker push gitlab.marathon.l4lb.thisdcos.directory:50000/root/howdy:${gitCommit()}"
        }


        // Deploy
        stage 'Deploy'

        marathon(
            url: 'http://marathon.mesos:8080',
            forceUpdate: false,
            credentialsId: 'dcos-token',
            filename: 'marathon.json',
            appid: 'howdy',
            docker: "gitlab.marathon.l4lb.thisdcos.directory:50000/root/howdy:${gitCommit()}".toString()
        )
    }
