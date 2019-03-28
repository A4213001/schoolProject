// var astar = require('./astar');
var fs = require('fs');

global.point = []; //當前位置
global.nextPoint = []; //下個位置
global.route = []; //預定路線
global.endPoint = []; //終點位置
global.direction = []; //前進方向
global.changeDirectionCount = 0;
global.numberPlate = []; //號碼牌
global.stepCount = []; //步數
global.changeRoute = []; //更換路徑
global.stopCount = []; //停止次數
global.totalStopCount = 0; //總停止次數
global.robotStatus = []; //robot狀態
global.startTime; //開始時間
global.cargo = JSON.parse(fs.readFileSync("cargo.json"));

global.mapXLength = 14; //地圖X長度
global.mapYLength = 10; //地圖Y長度

global.restStation = Array(mapXLength).fill(false); //休息站