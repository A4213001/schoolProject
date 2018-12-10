function Square(ctx){		//用canvas畫出方格
				var list = ["","Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ"];
				let XYlenght=10, //位置
					nowX=0,nowY=51; //陣列畫到的位置(nowY初始位置是第二排)
					distance=10, //兩隔間的距離
					size=41, //每格的大小
					listNum=1,
					listNumE=1;
					lastLenght=0;
					clearX=new Array(),
					clearY=new Array();
				ctx.fillStyle="black";
				for (var locationX = 0; locationX < XYlenght; locationX++) {	//走訪x
					for (var locationY = 0; locationY < XYlenght; locationY++) {	//走訪y
						if(locationX==0){	//第一排座標
							ctx.font = "normal 15px Arial";
							ctx.fillText(list[listNum],nowY-30.5,nowX+25);
							listNum++; } 
						if(locationX==9){	//最後一排座標
							ctx.font = "normal 15px Arial";
							ctx.fillText(list[listNumE],nowY+50,nowX+25);
							listNumE++;	} 
						ctx.strokeRect(nowY,nowX,size,size);
						nowX+=distance;
						nowX+=size;
					}
					nowY+=distance;
					nowY+=size;
					nowX=0;
				}
				ctx.font = "normal 10px Arial";	//設定id顯示的大小
			}

function Direction(now_X,now_Y,next_X,next_Y){	//判斷左右上下
				if (now_X>next_X) {return 'left'; }
				if (now_X<next_X) {return 'right'; }
				if (now_Y>next_Y) {return 'upper'; }
				if (now_Y<next_Y) {return 'under'; }
			}

function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {	//畫出箭頭

			    theta = typeof(theta) != 'undefined' ? theta : 15;
			    headlen = typeof(theta) != 'undefined' ? headlen : 30;
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
						drawArrow(ctx, nowY+35 ,nowX+20.5, nowY+5, nowX+20.5,30,15,2.5,'#fff');
						break;   

					case 'right':
						drawArrow(ctx, nowY+5, nowX+20.5, nowY+35 ,nowX+20.5,30,15,2.5,'#fff');
						break;

					case 'upper':
						drawArrow(ctx, nowY+20.5 ,nowX+35, nowY+20.5, nowX+5,30,15,2.5,'#fff');
						break;

					case 'under':
						drawArrow(ctx, nowY+20.5, nowX+5, nowY+20.5 ,nowX+35,30,15,2.5,'#fff');
						break;
				}
			}

function svgArrow(direction){
	switch(direction){
		case 'left':
			document.write('<img src="../">');
		case 'right':
		case 'upper':
			document.write('<img src="../images/arrow.svg">');
		case 'under':
	}
}

// function destination(){
// 	    socket.emit('destination',
// 	    {
// 	    	id : id
// 	    });
// 	};
// 	socket.on('return_endPoint',function(data)
//         {
//         	 status(data.id)		////////////////////////////////////////////////////////////
// 	    });

function init(cvs){
	cvs.addEventListener('mousedown', mouseMoveHandler);
}

   	var coordinateX,
   		coordinateY,
   		msg;
function mouseMoveHandler(event) {
   	let x=event.clientX-cvs.getBoundingClientRect().left,
   		y=event.clientY-cvs.getBoundingClientRect().top+51, 
   		lattice=41+10,//size+distance
   		size=41;
   	if((x%lattice<=size)&&(y%lattice<=size)){
   		coordinateX=Math.floor(x/lattice); //Math.floor去小數點
   		coordinateY=Math.floor(y/lattice);
   		msg = "座標: " +coordinateY+ "," +coordinateX;
   		if(coordinateX>10||coordinateX<1||coordinateY>10||coordinateY<1) msg=null;
   	}else{
   		msg = null;
   	}
    for (var data = 0; data < now.length; data++) {
		if ((now[data].x==(coordinateX-1))&&(now[data].y==(coordinateY-1))) {
			msg="id:"+data+"<br/>座標:"+coordinateY+ "," +	coordinateX;
			data=now.length;
		}
	}
   	document.getElementById("ppp").innerHTML=msg;
	status(0);
}

function status(id,x,y){
	document.getElementById(id).innerHTML='id:'+id+'<br/>現在座標:'+(y+1)+','+(x+1);
}
