services.msc

httpd.exe -k install -n "Apache HTTP Server"
nginx.exe -k install -n "NGINX HTTP Server"

nginx.exe -s start
nginx.exe -s stop

TASKKILL /F /IM "nginx*"

TASKKILL /F /IM "httpd*"

Update-Package -reinstall

 cd C:\nginx
 .\nginx.exe

RUN > Certmgr.msc

https://github.com/coreybutler/node-windows
https://www.coretechnologies.com/products/AlwaysUp/Apps/RunNodeJSAsAService.html

npm install --save lodash
npm install dotenv body-parser express web-push -S
npm install mssql
npm install --save cors
npm install socket.io

npm install node-fetch --save
npm install cron


npm install express-csv
npm install node-schedule
npm install agenda

## Getting Started

1. Clone this repository and `cd` into it.
2. Execute `npm install` to download dependencies.
3. Run `./node_modules/.bin/web-push generate-vapid-keys` to generate public/private VAPID key pair
4. Open `client/main.js` and `variables.env` and update them with your VAPID credentials
5. Run `node server.js` to start the Express server
6. Visit http://localhost:5000 in your browser.

'* * * * * *' - runs every second
'*/5 * * * * *' - runs every 5 seconds
'10,20,30 * * * * *' - run at 10th, 20th and 30th second of every minute
'0 * * * * *' - runs every minute
'0 0 * * * *' - runs every hour (at 0 minutes and 0 seconds)

 



	 node --max-old-space-size=4096 cache.js   // 4G 