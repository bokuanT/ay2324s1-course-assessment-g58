# Pushing to docker hub

** Reflect changes in env / source code in production by pushing to docker hub

Ensure FE env variable for matching & collab is routed to nginx ws endpoint

** Judge 0 error on ubuntu: https://github.com/judge0/judge0/issues/325

> You need to fallback to groups v1, here is how I did it on Ubuntu 22:

```
sudo nano /etc/default/grub
#edit this line, and save:
GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=0"
sudo update-grub
sudo reboot
```
> Cheers

## FE

From root dir:

`docker build -t bokuan/peerprep-frontend:latest . -f .\frontend\Dockerfile`

`docker push bokuan/peerprep-frontend:latest`

## Gateway

`docker build -t bokuan/peerprep-gateway:latest . -f .\gateway\Dockerfile`

`docker push bokuan/peerprep-gateway:latest`

## User service

`docker build -t bokuan/peerprep-user-service:latest . -f .\backend\user-service\Dockerfile`

`docker push bokuan/peerprep-user-service:latest`

## qns service

`docker build -t bokuan/peerprep-question-service:latest . -f .\backend\mongodb-database\Dockerfile`

`docker push bokuan/peerprep-question-service:latest`

## matching svc

`docker build -t bokuan/peerprep-matching-service:latest . -f .\backend\matching-service\Dockerfile`

`docker push bokuan/peerprep-matching-service:latest`

## collab svc

`docker build -t bokuan/peerprep-collaboration-service:latest . -f .\backend\collaboration-service\Dockerfile`

`docker push bokuan/peerprep-collaboration-service:latest`

## compiler svc

`docker build -t bokuan/peerprep-compiler-service:latest . -f .\backend\compiler-service\Dockerfile`

`docker push bokuan/peerprep-compiler-service:latest`

## email svc

`docker build -t bokuan/peerprep-email-service:latest . -f .\backend\email-service\Dockerfile`

`docker push bokuan/peerprep-email-service:latest`

## AI svc

`docker build -t bokuan/peerprep-ai-service:latest . -f .\backend\ai-service\Dockerfile`

`docker push bokuan/peerprep-ai-service:latest`
