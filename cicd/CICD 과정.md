# CI/CD



## 개발환경 및 사용 프로그램

- window 10
- Ubuntu 20.04 LTS (AWS EC2)
- xshell 7
- Filezilla



### Xshell 란

- TELNET/SSH 프로토콜로 리눅스 원격 호스트에 접속할 수 있는 윈도우용 터미널 에뮬레이터

### Nginx 란

> https://hyeo-noo.tistory.com/205
>
> https://developer88.tistory.com/299
>
> https://icarus8050.tistory.com/57

- 경량화된 웹 / 프록시 / TCP,UDP 프록시 서버

- 내부적으로 Event-Driven 방식으로 동작

  주기적으로 이벤트가 발생하는지 확인하고 발생 시 이벤트를 처리하는 것

- 클라이언트로부터 유청받았을 때, WAS를 거치지 않고 요청에 맞는 정적 파일을 응답하는

  HTTP 서버로 활용 가능

#### Proxy?

클라이언트의 요청을 서버로 보내주는 중계 서버

클라이언트 - 서버가 직접적으로 통신하지 않아서 보안,트래픽 분산, 캐시 사용 등 여러 장점을 가짐



### Docker란

- 어플리케이션을 신속하게 구축, 테스트, 배포할 수 있는 SW 플랫폼

- 소프트웨어를 컨테이너라는 표준화된 유닛으로 패키징하여 여기에 라이브러리,코드,런타임 등

  소프트웨어를 실행하는데 필요한 모든 걸 넣음

  따라서, 환경에 구애받지 않고 어플리케이션을 신속하게 배포,확장, 실행확인할 수 있음



## 과정

### Nginx 설치하기

```bash
sudo apt update
sudo apt-get install nginx

nginx -v # nginx/1.18.0
sudo /etc/init.d/nginx start # nginx 시작
```

### filezilla 연결

> https://deveric.tistory.com/25



### Docker 설치

> https://velog.io/@wimes/AWS-EC2%EC%97%90-Docker-%EC%84%A4%EC%B9%98-%EB%B0%8F-Dockerfile%EB%A1%9C-%EC%9B%B9%EC%84%9C%EB%B2%84-%EA%B5%AC%EB%8F%99%EC%8B%9C%ED%82%A4%EA%B8%B0
>
> https://pks2974.medium.com/jenkins-%EC%99%80-docker-%EA%B7%B8%EB%A6%AC%EA%B3%A0-aws-cli-%EC%82%BD%EC%A7%88%EA%B8%B0-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-e728986960e2
>
> https://skyblue300a.tistory.com/14



### Docker Compose 설치

> https://docs.docker.com/compose/install/

```bash
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
$ docker-compose --version
```





### Jenkins 설치

jenkins image가 docker hub에 있어서 그대로 사용했음

```
docker pull jenkins/jenkins:lts
```

Jenkins 기본 이미지만 제공해서 Dockerfile 세팅해야 함



### Dockerfile 세팅

> https://skyblue300a.tistory.com/14

```shell
# docker-compose.yml
version: "3"
services:
        jenkins:
                container_name: jenkins-compose
                build:
                        context: jenkins-dockerfile
                        dockerfile: Dockerfile
                user: root
                ports:
                        - 8000:8080
                        - 8888:50000
                volumes:
                        - /home/ubuntu/compose/jenkins:/var/jenkins_home
                        - /home/ubuntu/compose/.ssh:/root/.ssh

```



### Backend 연결

> https://chloe-codes1.gitbook.io/til/server/deployment/deploying_a_springboot-react_project_on_aws_ec2

- java 설치

  ```bash
  # julu-8 버전 설치용
  $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 0xB1998361219BD9C9
  $ sudo apt-add-repository 'deb http://repos.azulsystems.com/ubuntu stable main'
  $ sudo apt update
  $ sudo apt install zulu-11
  $ java -version
  ```

  

- (ec2) xshell에서 backend 폴더 만들기

- bootJar로 만든 jar 파일을 build/libs에서 (ec2) backend 폴더로 보내기(Filezilla 사용)

- 실행/배포하기

  ```bash
  $ (sudo) java -jar ooo.jar
  ```




### Frontend 연결

> https://chloe-codes1.gitbook.io/til/server/deployment/deploying_a_springboot-react_project_on_aws_ec2
>
> https://shinjongpark.github.io/2020/02/17/AWS-nginx-vue-spring-ssl.html

- nvm 설치하기

  ```bash
  $ sudo apt update  # update 하기
  $ sudo apt install -y build-essential
  $ sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
  $ nvm install 14.17.3
  $ node -v	# node 버전 확인
  $ npm -v	# npm 버전 확인
  $ sudo apt install -y nginx
  $ sudo service nginx status		# nginx 상태 확인
  ```

- frontend 파일 옮기기

  ```bash
  # react build하기 => build 폴더 생김
  # ec2로 옮기기(filezilla) 
  # permission denied 되면 => 해당 폴더 권한변경해주기
  $ sudo chmod -R 777 /var/www/html
  ```

- nginx 환경 설정

  conf 파일 설정

  ```bash
  $ cd /etc/nginx/sites-available
  $ sudo vi default
  ```

  ```bash
  #nginx 설정
  server {
          listen 80 default_server;
          listen [::]:80 default_server;
  
          server_name k5b103.p.ssafy.io;
  
          return 301 https://$server_name$request_uri;
  		
  		root /home/ubuntu/b103/frontend/build;
          index index.html index.htm ;
          
          location / {
                  try_files $uri $uri/ /index.html;
          }
  
          location /api {
                  proxy_pass http://localhost:8080/api;
                  proxy_redirect off;
                  charset utf-8;
  
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $scheme;
                  proxy_set_header X-NginX-Proxy true;
          }
  
          
  }
  
  
  server {
          listen 443 ssl;
          listen [::]:443 ssl;
  
          server_name k5b103.p.ssafy.io www.k5b103.p.ssafy.io;
          
          root /home/ubuntu/b103/frontend/build;
          index index.html index.htm ;
  
          ssl_certificate /etc/letsencrypt/live/k5b103.p.ssafy.io/fullchain.pem;
          ssl_certificate_key /etc/letsencrypt/live/k5b103.p.ssafy.io/privkey.pem;
  
          location / {
                  try_files $uri $uri/ /index.html;
          }
  
          location /api {
                  proxy_pass http://localhost:8080/api;
                  proxy_redirect off;
                  charset utf-8;
  
                  # for 502 bad gateway
  #                proxy_connect_timeout 300s; 
  #                proxy_read_timeout 600s; 
  #                proxy_send_timeout 600s; 
  #                proxy_buffers 8 16k; 
  #                proxy_buffer_size 32k;
  
  
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $scheme;
                  proxy_set_header X-NginX-Proxy true;
          }
          
  }
  
  server {
  	    if ($host = k5b103.p.ssafy.io) {
  	        return 301 https://$host$request_uri;
  	    }
  
  
  	        listen 80 ;
  	        listen [::]:80 ;
  	    server_name k5b103.p.ssafy.io;
  	    return 404;
  
  }
  ```
  
  
  
  ```bash
  # nginx 시작하기 or 재시작(restart)
  $sudo service nginx start
  ```



### SSL 적용

- letscencrypt 설치

  ```bash
  $ sudo apt-get update -y & sudo apt-get install letsencrypt -y
  ```

- nginx 중지

  ```bash
  $ sudo service nginx stop
  ```

- 인증서 발급

  ``` bash
  $ sudo letsencrypt certonly --standalone -d k5b103.p.ssafy.io
  ```

- nginx 설정파일 수정

  ```bash
  $ cd /etc/nginx/sites-available
  $ sudo vi default
  ```




### Jenkins 세팅

> https://slog97.tistory.com/38
>
> https://velog.io/@haeny01/AWS-Jenkins%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-Docker-x-SpringBoot-CICD-%EA%B5%AC%EC%B6%95
>
> ---
>
> <파이프라인>
>
> https://oookawesome.github.io/2018/07/07/JenkinsFile

```bash
$ sudo apt-get install gradle # gradle 설치
# gradle 최신 버전으로 업데이트
$ sudo add-apt-repository ppa:cwchien/gradle
$ sudo apt update
$ sudo apt install gradle
```

- Global Tool Configuration - jdk / gradle / nodejs 설치해주기

- git clone을 받으려면 credentials을 추가해야 함

  add credentials - username/pw : gitlab id/pw / ID: 내가 쓸 아이디
  
- 파이프라인 코드

```bash
pipeline {
    agent any
    tools{
        // jdk "zulu8"
        nodejs "Node 14.17.3"
        gradle "gradle 7.2"
    }

    stages {
        stage('git clone') {
            steps {
                echo "Clone gitlab"
                git branch: 'master', credentialsId: 'interview', url: 'https://lab.ssafy.com/s05-final/S05P31B103'
            }
            post {
                success {
                    echo "git clone success!"
                }
            }
        }
        stage('build'){
            steps{
                dir('frontend'){
                    echo "build frontend"
                    sh "npm install"
                    sh "CI=false npm run build"
                }
                dir('backend'){
                        echo "build backEnd"
                        sh "chmod +x gradlew"
                        sh "./gradlew clean bootJar"
                }
            }
        }
        stage('move files'){
            steps{
                dir('frontend'){
                    echo "move frontend"
                    sh "scp -r /var/jenkins_home/workspace/k5b103a/frontend/build ubuntu@172.26.10.159:/home/ubuntu/b103/frontend"
                }
                dir('backend'){
                    echo "move backend"
                    sh "scp -r /var/jenkins_home/workspace/k5b103a/backend/build/libs/interview-0.0.1-SNAPSHOT.jar ubuntu@172.26.10.159:/home/ubuntu/b103/backend"
                }
            }
        }
        
        stage('deploy & restart') {
            steps([$class: 'BapSshPromotionPublisherPlugin']) {
                sshPublisher(
                    continueOnError: false, failOnError: true,
                    publishers: [
                        sshPublisherDesc(
                            configName: "interview",//Jenkins 시스템 정보에 사전 입력한 서버 ID
                            verbose: true,
                            transfers: [
									//sshTransfer(execCommand: "sudo chmod 744 /home/ubuntu/b103/backend/deploy.sh"),
                                    sshTransfer(execCommand:"sh /home/ubuntu/b103/backend/deploy.sh"),
									sshTransfer(execCommand : "sudo service nginx restart")

                            ]
                        )
                    ]
                )
        }
        post{
            success{
                echo "CICD Finish"
            }
        }
    }
        
    }
}

```

- deploy.sh

```sh
# deploy.sh
# vi deploy.sh 로 /home/ubuntu/b103/backend/ 여기에 작성해놓음

#!/bin/bash

REPOSITORY=/home/ubuntu/b103/backend/
JAR_NAME=interview-0.0.1-SNAPSHOT.jar

echo "Move To Repository"
echo $REPOSITORY
cd $REPOSITORY

echo "Find Current PID"
CURRENT_PID=$(ps -ef|grep "$JAR_NAME"|awk '{print $2}')

echo "$CURRENT_PID"

if [ -z "$CURRENT_PID" ]
then
  echo "Start New Process"
else
  echo "Kill Current Process"
  kill -15 $CURRENT_PID
  sleep 3
fi

echo "Deploy Application"
nohup java -Dspring.profiles.active=prod -jar $JAR_NAME > /dev/null 2>&1 &
```



### 기타

- 도커 확인용 명령어

```bash
# 현재 container name: jenkins-compose
# 도커 컨테이너 내부로 접속
$ docker exec -it jenkins-compose /bin/bash
# jenkins_home 상태 확인법
$ sudo docker exec -it jenkins-compose ls -lrt /var/jenkins_home/workspace/k5b103a/test/
/var/jenkins_home/workspace/k5b103a/backend/build/libs/interview-0.0.1-SNAPSHOT.jar
/home/ubuntu/b103/
```



- scp 명령어가 계속 안됐다.

  ```bash
  $ scp /var/jenkins_home/workspace/k5b103a/backend/build/libs/interview-0.0.1-SNAPSHOT.jar ubuntu@172.26.10.159:/home/ubuntu/b103/
  # Host key verification failed.
  ```

  jenkins 홈페이지에서 publish over SSH에서는 success가 뜨는데 막상 pipeline으로 돌리면 안됐다.

  직접 로컬에서 실행해보니, 여러 문구가 떴다.

  ```
  root@5a246133ded1:/# scp /var/jenkins_home/workspace/k5b103a/backend/build/libs/interview-0.0.1-SNAPSHOT.jar ubuntu@172.26.10.159:/home/ubuntu/b103/
  The authenticity of host '172.26.10.159 (172.26.10.159)' can't be established.
  ECDSA key fingerprint is SHA256:+t85iX4sZW+rFlR27gCrV5c44GaJrc3KKeKqvTVqhEE.
  Are you sure you want to continue connecting (yes/no/[fingerprint])? y
  Please type 'yes', 'no' or the fingerprint: yes
  Warning: Permanently added '172.26.10.159' (ECDSA) to the list of known hosts.
  ```

  즉, 아직 알려진 서버, 접속이 허용된 서버가 아니어서 허용하겠냐는 질문이었다.

  yes 로 하니, 로컬에서 됐고, 파이프라인으로 실행해보니 됐다...

  흠... 젠킨스 컨테이너에서 publish,private 키를 받을 필요가 있긴했나 의문이 든다.

  

- linux 명령어

  ```
  $ ps -ef
  ps -ef 명령어를 실행하면 현재 실행중인 프로세스들 전부 확인 가능
  $ ps -ef | grep “keyword”
  원하는 키워드만 확인 가능
  ```




## Q&A

- 파일 옮기기 테스트 중인데, jenkins 내부에서는 `mv`로 옮길 수 있지만, jenkins - aws 사이에서는 안됨

  정확히 말하면 directory가 없다고 함

  그래서  `scp`로 하려고 publish over ssh 설정을 했는데 여기서는 success가 남

  근데, 막상 보내보니 host failed 가 뜸.

  

  => 해결 완료

  ​	로컬에서 미등록 서버여서 등록해주니 파이프라인에서도 사용이 됐다.
  
  
  
- Jenkins 파이프라인에서 빌드할 때, react 는 "CI=false yarn build" 를 사용함



- nginx 에러.......

  ![image-20211117173708023](CICD%20%EA%B3%BC%EC%A0%95.assets/image-20211117173708023.png)

  ![image-20211117173624283](CICD%20%EA%B3%BC%EC%A0%95.assets/image-20211117173624283.png)

```
# for 502 bad gateway
proxy_connect_timeout 300s; 
proxy_read_timeout 600s; 
proxy_send_timeout 600s; 
proxy_buffers 8 16k; 
proxy_buffer_size 32k;

```



포스트맨으로는 되눈데, 업데이트 후 안되고 이 에러가 나옴

프론트 base url포트를 8080 으로 돌리면,

![image-20211117201603533](CICD%20%EA%B3%BC%EC%A0%95.assets/image-20211117201603533.png)



백엔드는 http://localhost:8080 사용중

nginx는 443, 80 포트 사용중, 이를  http://localhost:8080 로 넘겨줌



- 문제

  - 프론트엔드에서 https://k5b103.p.ssafy.io:443/ 로 api 요청함

    => 502 bad gateway

  - 프론트엔드에서 https://k5b103.p.sssafy.io:8080/ 으로 api 요청함

    postman에서 https://k5b103.p.ssafy.io/ 로 api 요청 테스트 => 성공

    배포서버 ( https://k5b103.p.sssafy.io ) 에서 테스트 => ERR_SSL_PROTOCOL_ERROR



​	=> 해결완료

```java
server_address=0.0.0.0 // 이 부분이 스프링 프로퍼티에 있었음 => 제거
```



- 배포가 중간에 꼬일 수도 있나보다..

  502 gateway가 나서 재배포했더니 문제가 해결됐다!



- 413 에러 (Nginx)

  https://blog.leocat.kr/notes/2020/04/21/nginx-413-request-entity-too-large

  ```
  client_max_body_size 5M;
  ```

  server 블록에 넣어주면 해결

