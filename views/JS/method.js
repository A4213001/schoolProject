function Square(ctx){
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