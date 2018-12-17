# 專案說明

## 開發環境
* Node.js-v10.14.0(https://nodejs.org/en/)
* Sublime Text(https://www.sublimetext.com/)

## 執行方法
1. 打開cmd並進入專案資料夾
2. 輸入指令```node app.js```
3. 打開瀏覽器進入測試頁面首頁```localhost:80/home```

## 簡易說明
+ ```app.js``` ----> Server
+ ```astar.js``` ----> astar路徑規劃
+ ```view/robot.ejs``` ----> 模擬機器人的前端頁面
+ ```view/home.ejs``` ----> 芷涵製作的前端頁面
+ ```view/line.ejs``` ----> 先旻製作的簡易前端畫面

## 使用套件說明
+ astar-0.4.1(https://github.com/bgrins/javascript-astar)
+ jquery-3.3.1(https://jquery.com/)
+ bootstrap-3.3.6(https://getbootstrap.com/)
+ socket.io-6.3.0(https://socket.io/)

## socket.io事件說明
+ ```socket.emit('message', "this is a test"); //sending to sender-client only```
+ ```socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender```
+ ```socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender```
+ ```socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)```
+ ```socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid```
+ ```io.emit('message', "this is a test"); //sending to all clients, include sender```
+ ```io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender```
+ ```io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender```
+ ```socket.emit(); //send to all connected clients```
+ ```socket.broadcast.emit(); //send to all connected clients except the one that sent the message```
+ ```socket.on(); //event listener, can be called on client to execute on server```
+ ```io.sockets.socket(); //for emiting to specific clients```
+ ```io.sockets.emit(); //send to all connected clients (same as socket.emit)```
+ ```io.sockets.on() ; //initial connection from a client.```

## 先旻的git簡易教學
### 連接雲端專案
+ ```git clone https://github.com/A4213001/schoolProject.git```

### 將本機上傳至雲端時的步驟為
1. 請先確定專案可以正常執行(不影響他人使用)。
2. ```git status``` 查看修改狀態 or ```git status -s``` 查看簡易版的修改狀態。
3. 可先於github上確認雲端上有沒有進行修改過，若有修改過執行```git pull```將雲端上的資料下載至本機，若出現衝突請先處理好再繼續下一步。
4. 若第3步有pull新修改後的檔案下來，請再執行一次第1步。
5. ```git add .``` 將全部修改的檔案加入至提交於雲端的儲存庫中，若只要提交部分檔案請使用```git add (檔名)```。
6. ```git commit -m '(註解)'``` 將此次修改的項目註解上去。
7. 再執行一次第3步，因為進行4~6步時有可能剛好有人push。
8. ```git push``` 將本機的檔案更新至雲端上。

### 切換分支
+ ```git checkout (分支名稱)```

## git相關工具教學
* https://github.com/doggy8088/Learn-Git-in-30-days/blob/master/zh-tw/02.md

* * *
## 預定完成項目
### 先旻(後端)
1. 卡死的問題處理
2. 逆向的問題處理
3. 各種資料傳送事件
4. 定義及傳送狀態 : 已保存各種停止狀態
5. 製作數據產生用版本(至少3種版本)
6. 數據細項
  1. 各貨物運送花費時間
  2. 總運送時間(共200個貨物)
  3. 停止次數
  4. 轉彎次數

### 芷涵(前端)
1. 顯示機器人狀態(選擇單一、整體、輪播(可考慮))	OK
2. 顯示單一機器人累積步數
3. 顯示單一機器人路徑
4. 顯示號碼牌(單一格子、單一機器人、整體)
5. 區別單行道
6. 顯示當前機器人數量	OK
7. 手動模式操作頁面
8. static檔案優化(創建public資料夾於專案內存放static檔案)

### 共通
1. 製作正式demo用版本(預計大小4*14)
2. 將共有變數抽出，做成一個config檔
3. 不連外網也要能正常運作
