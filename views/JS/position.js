window.onload=function(){
	var jsontext_now = '[{"id" : 3,  "x" : 0,  "y" : 2	},{	"id" : 4,	"x" : 2,	"y" : 3 },{ "id" : 1,	"x" : 9,	"y" : 5 }]'
	var jsontext_next = '[{"id" : 3,  "x" : 1,  "y" : 2	},{	"id" : 4,	"x" : 1,	"y" : 3 },{ "id" : 1,	"x" : 9,	"y" : 4 }]'
	var now = JSON.parse(jsontext_now);
	var next = JSON.parse(jsontext_next);
	let XYlenght=10, //位置
		nowX=0,nowY=0, //陣列畫到的位置
		distance=20, //兩隔間的距離
		size=82; //每格的大小
	var cvs=document.getElementById("cvs");
	var ctx=cvs.getContext("2d");
	ctx.fillStyle="black";
	for (var location1 = 0; location1 < XYlenght; location1++) {	//走訪x
		for (var location2 = 0; location2 < XYlenght; location2++) {	//走訪y
			for (var data = 0; data < now.length; data++) {	//走訪現在位置的data
				if (location1==now[data].x && location2==now[data].y) {	//位置 vs data
					ctx.fillRect(nowY,nowX,size,size);
					Arrow(ctx,nowX,nowY,now[data].x,now[data].y,next[data].x,next[data].y);
					ctx.fillStyle="white";
					ctx.font = "normal 20px Arial";
					ctx.fillText(now[data].id,nowY+65,nowX+70);
					ctx.fillStyle="black";
				} else {
					ctx.strokeRect(nowY,nowX,size,size);
				}
			}
			nowX+=distance;
			nowX+=size;
		}
		nowY+=distance;
		nowY+=size;
		nowX=0;
	}
}

function Direction(now_X,now_Y,next_X,next_Y){	//判斷左右上下
	if (now_X>next_X) {return 'left'; }
	if (now_X<next_X) {return 'right'; }
	if (now_Y>next_Y) {return 'upper'; }
	if (now_Y<next_Y) {return 'under'; }
}

function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {	//畫出箭頭

    theta = typeof(theta) != 'undefined' ? theta : 30;
    headlen = typeof(theta) != 'undefined' ? headlen : 10;
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#000';
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);

    ctx.save();
    ctx.beginPath();

    var arrowX = fromX - topX,
        arrowY = fromY - topY;

    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}

function Arrow(ctx,nowX,nowY,now_X,now_Y,next_X,next_Y){	//根據上下左右對應到function
	switch(Direction(now_X,now_Y,next_X,next_Y)){
		case 'left':
			drawArrow(ctx, nowY+70 ,nowX+41, nowY+10, nowX+41,30,30,5,'#fff');
			break;   

		case 'right':
			drawArrow(ctx, nowY+10, nowX+41, nowY+70 ,nowX+41,30,30,5,'#fff');
			break;

		case 'upper':
			drawArrow(ctx, nowY+41 ,nowX+70, nowY+41, nowX+10,30,30,5,'#fff');
			break;

		default:
			drawArrow(ctx, nowY+41, nowX+10, nowY+41 ,nowX+70,30,30,5,'#fff');
			break;
	}
}