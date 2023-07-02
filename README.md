# Docs:
- Compute Engine: https://cloud.google.com/compute/docs/instances
- Nodejs with Compute Engine: https://cloud.google.com/nodejs/getting-started/getting-started-on-compute-engine

# Các bước thực hiện:
## 1. Tạo VM instance (dùng Ubuntu)
## 2. Sử dụng SSH:
- Update package apt: ```sudo apt-get update```
- Cài Nodejs : https://github.com/nodesource/distributions#using-ubuntu-5
- Cài npm: ```sudo apt install npm```

## 3. Upload code: bằng file upload hoặc dùng git clone

## 4. Cài đặt Firewall: 
Tạo bằng UI: Menu -> VPC network -> Firewall -> Create Firewall rule
- Name: default-allow-http-6868 (name j cũng được)
- Protocols and ports: Tcp: 6868 (port khai báo trong code của project)
- Source filters: IP ranges: 0.0.0.0/0
- Target tags: http-server

## 5. Test chạy server: 
```npm run start```

## 6. Cấu hình chạy ngầm:
- Cài supervisor: http://supervisord.org/running.html#supervisorctl-command-line-options
- Command:
```apt-get install -yq ca-certificates git build-essential supervisor```
- Cấu hình: 
```
cat >/etc/supervisor/conf.d/node-app.conf << EOF
[program:nhanc18]
directory=/home/nhanc18/testApi
command=npm run start
autostart=true
autorestart=true
user=nhanc18
environment=HOME="/home/nhanc18",USER="nhanc18",NODE_ENV="production"
stdout_logfile=syslog
stderr_logfile=syslog
startsecs=0
EOF
```
- Restart supervisor:

`sudo supervisorctl reread`

`sudo supervisorctl update`

## 7. Kiểm tra:
- Kiểm tra các cổng đang được listen: `sudo lsof -i -P -n | grep LISTEN`
- Stop all Nodejs: `killall node`
- Kiểm tra tình trạng supervisor: `sudo supervisorctl status`
- Stop supervisor process tên nhanc18: `sudo supervisorctl stop nhanc18`
- Start supervisor process tên nhanc18: `sudo supervisorctl start nhanc18`

# GOOGLE CLOUD LOGGING:
## 1. Setup Google Fluentd: 
```
sudo su
curl -s "https://storage.googleapis.com/signals-agents/logging/google-fluentd-install.sh" | bash
service google-fluentd restart
```
## 2. Cài Bunyan:
https://cloud.google.com/logging/docs/setup/nodejs
## 3. Script:
```
import bunyan from 'bunyan';
import lb from '@google-cloud/logging-bunyan';

const app = express();
const loggingBunyan = new lb.LoggingBunyan();
const logger = bunyan.createLogger({
    name: 'nhanc18-log',
    streams: [
        {stream: process.stdout, level: 'info'},
        loggingBunyan.stream('info'),
    ],
});

logger.info('nhanc18-log: Hello, world!');
```