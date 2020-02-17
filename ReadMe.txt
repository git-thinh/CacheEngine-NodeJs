npm install cookie-parser grpc redis level uuid grpc @grpc/proto-loader body-parser express socket.io lodash node-fetch mssql cron

node --max-old-space-size=4096 logview.js
node --max-old-space-size=4096 app.js
node --max-old-space-size=4096 db2txt.js

.\txt2tcp.exe 1000


.\vcpkg install leveldb:x86-windows
.\vcpkg install restbed leveldb
.\vcpkg export restbed leveldb --zip
.\vcpkg export gtest zlib gtest:x64-windows zlib:x64-windows --nuget


protoc.exe --grpc_out=. --plugin=protoc-gen-grpc=grpc_cpp_plugin.exe message.proto
protoc.exe --grpc_out=. --plugin=protoc-gen-grpc=grpc_node_plugin.exe message.proto
protoc.exe --grpc_out=. --plugin=protoc-gen-grpc=grpc_csharp_plugin.exe message.proto

protoc.exe --cpp_out=message.proto


npm install cookie-parser
npm install grpc
npm install redis
npm install uuid

# https://codelabs.developers.google.com/codelabs/cloud-grpc/index.html?index=..%2F..index#7
# 

node --max-old-space-size=4096 app.js

npm install grpc
npm install @grpc/proto-loader
npm install -g grpc-tools
npm install events
npm install async-retry

npm install level --save
npm install dotenv mssql cron body-parser express socket.io lodash node-fetch -S


protoc.exe --js_out=import_style=commonjs,binary:. --grpc_out=. --plugin=protoc-gen-grpc=grpc_node_plugin.exe message.proto



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