function Square(ctx,sizeX,sizeY){		//用canvas畫出方格
				var list = ["","Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ"];
				let nowX=0,nowY=51; //陣列畫到的位置(nowY初始位置是第二排)
					distance=10, //兩隔間的距離
					size=41, //每格的大小
					listNum=1,
					listNumE=1;
					lastLenght=null;
					clearX=new Array(),
					clearY=new Array();
				ctx.fillStyle="black";
				for (var locationX = 0; locationX < sizeX; locationX++) {	//走訪x
					for (var locationY = 0; locationY < sizeY; locationY++) {	//走訪y
						if(locationX==0){	//第一排座標
							ctx.font = "normal 15px Arial";
							ctx.fillText(list[listNum],nowY-30.5,nowX+25);
							listNum++; } 
						if(locationX==sizeX-1){	//最後一排座標
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

function initMouse(cvs){
	cvs.addEventListener('mousemove', mouseMoveHandler);
	cvs.addEventListener('mousedown', mouseDownHandler);
    cvs.addEventListener('dblclick', onDocumenDblClick);
}

   	var coordinateX,
   		coordinateY,
   		msg;
function mouseMoveHandler(event) {
   	let x=event.clientX-cvs.getBoundingClientRect().left,
   		y=event.clientY-cvs.getBoundingClientRect().top+51, 
   		msg = "座標: " +getCoordinate(x,y).y+ "," +getCoordinate(x,y).x ;
   		document.getElementById("cvs").title=msg;
}

function getCoordinate(x,y){
   	let	lattice=41+10,//size+distance
   		size=41;
   	if((x%lattice<=size)&&(y%lattice<=size)){
   		coordinateX=Math.floor(x/lattice); //Math.floor去小數點
   		coordinateY=Math.floor(y/lattice);
   		if((coordinateX>Xlenght)||(coordinateX<1)||(coordinateY>Ylenght)||(coordinateY<1)) return null;
   	}else{
   		return null;
   	}
   	return {  'x' : coordinateX , 'y': coordinateY};
}

var screen=true;
function mouseDownHandler(event){
   screen?outputCoordinate():inputChangeAim(coordinateX,coordinateY);
}

function outputCoordinate(){
   	if (getId()!=null) {
		document.getElementById("mouseDown").innerHTML="id: "+getId()+"<br/>"+"目標座標: ("+getAim().x+","+getAim().y+")";
		// document.getElementById("mouseDown").innerHTML+="目標座標: ("+getAim(getId()).x+","+getAim(getId()).y+")";
   	}else document.getElementById("mouseDown").innerHTML="";
}

function getAim(){   //////////////////測試
	for(i in aim){
		if(aim[i].id==getId()) return {'x' : aim[i].x , 'y': aim[i].y};
		// return aim[i].id==getId()?{'x' : aim[i].x , 'y': aim[i].y};
	}
}

function getId(){
	for (var data = 0; data < now.length; data++) {
		if ((now[data].x==(coordinateX-1))&&(now[data].y==(coordinateY-1))) {
			// data=now.length;
			return now[data].id;
		}
	}
	return null;
}

var focusId;
function onDocumenDblClick(event) {
	// $(function() {
	// 	$( event ).dialog({
 //                    buttons: {
 //                        "Yes": function() {alert('you chose yes');},
 //                        "No":  function() {alert('you chose no');},
 //                        "Cancel":  function() {
 //                            alert('you chose cancel');
 //                            dialog.dialog('close');
 //                        }
 //                    }
 //                });
 //  	});
	if(getId()!=null){
		document.getElementById("dddd").innerHTML="請點選目的地或<button onclick='closeChangeAim()'>取消</button>";
		screen=false;
		focusId=getId();
	}
}

function inputChangeAim(x,y){  //
	//傳給後端x,y
	//等待後端傳成功的訊息
	outputChangeAim(x,y);
}

function closeChangeAim(){
	screen=true;
	document.getElementById("dddd").innerHTML="已取消";
}

function outputChangeAim(x,y){
	document.getElementById("dddd").innerHTML="("+x+","+y+")輸入完成";
	screen=true;
}

var aim=new Array();
$(document).ready(function() {
	socket.on('changeEndPoint', function(data) {
		let end=data.endPoint,
			input=false;
		for(i in aim){
			if(aim[i].id==end.id){
				aim[i].x=end.x;
				aim[i].y=end.y;
				input=true;
				break;
			}
		}
		if(!input) aim.push({ 'id': end.id, 'x': end.x, 'y': end.y });
	});
});