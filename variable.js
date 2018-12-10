var astar = require('./astar');

global.robotCount = 0; //機器人數量
global.point = new Array(); //當前位置
global.nextPoint = new Array(); //下個位置
global.route = new Array(); //預定路線
global.endPoint = new Array(); //終點位置
global.direction = new Array(); //前進方向
global.number_plate = new Array(); //號碼牌
global.stepCount = new Array(); //步數
global.changeRoute = new Array(); //更換路徑
global.stopCount = new Array(); //停止次數
global.robotStatus = new Array(); //robot狀態

global.mapLength = 10;

//---graphInit---
global.x = new Array(mapLength);
for(var i = 0; i < mapLength; i++){
	x[i] = Array(mapLength).fill(1);
}
global.graph = new astar.Graph(x);
//