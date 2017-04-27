
var img_stage,img_L_char,img_R_char,img_block,img_nico,img_eraser,img_nowloading,img_goal;
var width=1000,height=600;//画面のサイズ
var ymoveCount=-1;
var xmoveCount=-1;
var rlFlag=0;//0なら右向き
var game=0;
var clearTime=0;
var clearFlag=0;
var topMenuFlag=0;
var clickPointX=0,clickPointY=0;
var mode=0;
var stageNum=-1;
var startTime=0;
var saveFlag=0;
var createGameFlag=0;
var playGameFlag=0;
var saveWindowFlag=0;//saveメニュー画面の表示時にONにする
var deadFlag=0;//死んだら1にする
var menuMode=0;//メニューバーを使用中は1にする
var xAddValue=0,yAddValue=0;//疑似カメラを作るための変数
var boxAddFlag=0;//レンガを配置するかどうかのフラグ
var goalFlag=0;//
var loadingFlag=0;
var leftClickVar=0;//
var boxEraseFlag=0;//レンガを消すかどうかのフラグ
var countYmove=1,countYmoveFlag=0;//
var time,jtime;//現在の時間と，ジャンプした時間の変数
var mouseX=0,mouseY=0;
var ctx,e;
var boxSize=[40,40];//レンガの描画サイズ
var charSize=[40,40];//メインキャラの描画サイズ
var posx=0,posy=0,deadPointx=0,deadPointy=0,weight=0;
var jArray=[25,25,25,25,25,25,25];//メインキャラがジャンプしたあとのy方向の移動の配列
var xArray=[10,6,5,5,3,3,2,1];//メインキャラが左右への移動する距離の配列
var xy=[];//レンガのxy座標
var monster=[];//ニコニコテレビちゃんのxy座標
var monsterx=[];
var nl_xy=[];//NowLoadingのxy座標
var selectFlag=[];
var plusFlag=[];
var minusFlag=[];
var goal=[];//GOALのxy座標
var mousePressed=0;
var underCollisionCheck=0,preUnderCollisionCheck=0;//メインキャラ底面がブロックに接している時以外はジャンプさせないために用いる変数
var dropFlag=1;
var w=0;
var hightlitedItem=0;
var ifHighlited=0;
var test=0;
var gameStartTime=0;


var smallBarTop=0;
var smallBarBottom=0;
function createSideBar(x,y,w,h,maxh)
{
	ctx.fillStyle = 'rgb(240, 240 ,240)';
	ctx.fillRect(x,y,w,h);
	var smallBarHeight=h*(h/maxh);
	if(mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h) 
	{
		if(mousePressed==1)
		{
			smallBarTop=mouseY-smallBarHeight/2;
			if(smallBarTop<=0)smallBarTop=0;
			smallBarBottom=mouseY+smallBarHeight/2;
			if(smallBarBottom>=h)smallBarTop=h-smallBarHeight;
		}
	}
    ctx.fillStyle = 'rgb(170,170,170)';
    ctx.fillRect(x,smallBarTop,w,smallBarHeight);
	
	var percentage=(smallBarTop-y)/((h-smallBarHeight)-y);
	var scrollY= -(maxh-h)*percentage;
	return scrollY;
}
//保存されたシーンデータを読み込み
function loadMikuDraw(num)
{
    resetGame();
	var line=0;
    var req = new XMLHttpRequest();
    req.open("GET","test/data/stage/stage"+num+".txt",false);
    req.send(null);
    var text=req.responseText;
    //var s="0 40 40 80 \n";
	var s = text.split(/\r\n|\r|\n/);

	for (var i = 0; i < s.length; i++) 
	{
	  var array = s[i].split(" ");
	  for (var j=0; j < array.length; j++)
	  {
		 if("\n"!=array[j])
		 {
		   if(line==0)
		   {
			 xy.push(Number(array[j]));
		   }
		   if(line==1)
		   {
			 monster.push(Number(array[j]));
		   }
		   if(line==2)
		   {
			 monsterx.push(Number(array[j]));
			 minusFlag.push(1);
			 plusFlag.push(0);
		   }
		   if(line==3)
		   {
			 nl_xy.push(Number(array[j]));
		   }
		   if(line==4)
		   {
			 goal.push(Number(array[j]));
		   }
		 }
	  }
	  line++;
	}
    game=1;

  gameStartTime = Date.now()/1000; 
}
function playGame()
{
  //背景描画
  ctx.fillStyle = 'rgb(0, 0 ,0)';
  ctx.fillRect(0,0,1000,600);
  
  var space=220;
  var defaultY=-130;

  //ファイル数を取得
  var req = new XMLHttpRequest();
  req.open("GET","test/data/stage/numCount.txt",false);
  req.send(null);
  var text=req.responseText;
  
  var scrollY=createSideBar(970,0,30,600,Number(text)*300);
  stageNum=-1;
  for (var i = 1; i <= text; i++)
  {
		ctx.fillStyle = 'rgb(157, 204 ,224)';
        var selectFlag=highlightButton(45,defaultY+space*i+scrollY,900,200,20);
        if(selectFlag==1)
        {
          stageNum=i;
        }
		ctx.drawImage(img_stage[i-1], 80, defaultY+20+space*i+scrollY,width/3.7,height/3.7);
        ctx.font = 'italic 400 40px/2 Unknown Font, sans-serif';
		ctx.fillStyle = 'rgb(0, 0 ,0)';
        ctx.fillText("Stage"+i, 600,defaultY+110+space*i+scrollY ); // 表示するテキスト, x座標, y座標
  }
  
  topMenuButton();
}
function topMenuButton()
{ 
  ctx.fillStyle = 'rgb(125, 135 ,125)';
  topMenuFlag=highlightButton(50,0,120,60);
  ctx.fillStyle = 'rgb(255, 255 ,255)';
  ctx.font = 'italic 400 25px/2 Unknown Font, sans-serif';
  ctx.fillText("TopMenu", 54,35);
}
function highlightButton(x,y,sizex,sizey)
{
  var selectFlag=0;
  if(mouseX >= x && mouseX <= x+sizex && mouseY >= y && mouseY <= y+sizey) 
  {
	 ctx.strokeStyle = "rgb(255, 255, 255)";
	 ctx.lineWidth=8;
	 ctx.strokeRect(x,y,sizex,sizey);
     selectFlag=1;
	 ifHighlited=selectFlag;
  }
  ctx.fillRect(x,y,sizex,sizey);
  ctx.lineWidth=0;
  return selectFlag;
}
function resetGame()
{
  xy=[];
  monster=[];
  monsterx=[];
  nl_xy=[];
  goal=[];
  posx=0;
  posy=0;
  leftClickVar=0;
  deadFlag=0;
  weight=0;
  deadPointx=0;
  deadPointy=0;
  clearFlag=0;
  xAddValue=0;
  yAddValue=0;
  hightlitedItem=0;
}
function test(){}
function game_init()
{
	var canvas = document.getElementById("canvas");
	window.addEventListener('keydown' , function(e){keydownfunc(e);} , true);
	canvas.addEventListener('mousedown', function(e){mousePressed=1;}, false);
	canvas.addEventListener('mouseup', function(e){mousePressed=0;}, false);
	canvas.addEventListener('mousemove', function(e){mouseMove(e);}, false);		
	canvas.addEventListener('click', function(e){onClick(e);}, false);
	if (canvas.getContext)
	{
		ctx = canvas.getContext('2d');
	    var req = new XMLHttpRequest();
	    req.open("GET","test/data/stage/numCount.txt",false);
	    req.send(null);
	    var text=req.responseText;
		img_stage = new Array();
		for (var i = 1; i <= text; i++)
		{
			img_stage[i-1] = new Image();
			img_stage[i-1].src = "test/data/stage"+i+".png";
		}
	    img_block = new Image();
	    img_block.src = "test/data/block.png";
	    img_L_char = new Image();
	    img_L_char.src = "test/data/miku_L_walk.png";
	    img_R_char = new Image();
	    img_R_char.src = "test/data/miku_R_walk.png";
	    img_nico = new Image();
	    img_nico.src = "test/data/nico.png";
	    img_eraser = new Image();
	    img_eraser.src = "test/data/eraser.png";
	    img_goal = new Image();
		img_goal.src = "test/data/goal.png";
	    img_nowloading = new Image();
		img_nowloading.src = "test/data/nowloading.png";
		
		setInterval("draw()", 20);

	}
}
function gameSelect()
{
  //背景描画
  ctx.fillStyle = 'rgb(0, 0 ,0)';
  ctx.fillRect(0,0,1000,600);

  //ゲームで遊ぶ
  ctx.fillStyle = 'rgb(157, 204 ,224)';
  var flag=highlightButton(70,70,400,430);
  if(flag==1)playGameFlag=1;
  else playGameFlag=0;
  ctx.fillStyle = 'rgb(0, 0 ,0)';
  ctx.font = 'italic 400 35px/2 Unknown Font, sans-serif';
  ctx.fillText("ゲームで遊ぶ", 170,290);

  //ゲームを作る
  ctx.fillStyle = 'rgb(255,160,167)'; // 赤
  var flag=highlightButton(520,70,400,430);
  if(flag==1)createGameFlag=1;
  else createGameFlag=0;
  ctx.fillStyle = 'rgb(0, 0 ,0)';
  ctx.font = 'italic 400 35px/2 Unknown Font, sans-serif';
  ctx.fillText("ゲームを作る", 610,290); // 表示するテキスト, x座標, y座標
}
function eraseBox()
{
  for(var i=0;i<xy.length;i+=2)
  {
    if(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]==xy[i] && mouseY+yAddValue-(mouseY+yAddValue)%boxSize[1]==xy[i+1])
    {
      xy.splice(i, 2);
    }
  }
  for(var i=0;i<monster.length;i+=2)
  {
    if(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]==monster[i]+monsterx[i/2] && mouseY+yAddValue-(mouseY+yAddValue)%boxSize[1]==monster[i+1])
    {
      monster.splice(i, 2);
    }
  }
  for(var i=0;i<nl_xy.length;i+=2)
  {
    if(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]==nl_xy[i] && mouseY+yAddValue-(mouseY+yAddValue)%boxSize[1]==nl_xy[i+1])
    {
      nl_xy.splice(i, 2);
    }
  }
}
function nowLoading()
{/*
  for(var j=0;j<nl_xy.length;j+=3)
  {
    angle=0;//四角形の初期配置角度
    var r=60;//円の半径を指定
    nl_xy[j+2]=nl_xy[j+2]+PI/50;
    for(var i=0;i<14;i++)
    {
      pushMatrix();//現在座標を保存
      angle=2*PI/20*i;//円周を20等分して四角形を12個配置(8個分のスペースが余る)
      translate(nl_xy.get(j)-xAddValue,nl_xy.get(j+1)-yAddValue);//円の中心座標を指定
      translate(r*cos(angle + nl_xy.get(j+2)),r*sin(angle + nl_xy.get(j+2)));//配置する四角形の座標を指定，nl_xy.get(j+2))の角度分回転アニメーション
      rotate(angle+nl_xy.get(j+2));//配置された四角形の角度を指定
      fill(255, 255, 255);//白色で描画する宣言
      if(i<5)fill(255-(6-i)*20);//尾にむけてグラデーションをかける設定
      rect(0,0,20,10);//四角形の描画
      popMatrix();//元の座標に戻す
    }
    float firstPos=nl_xy.get(j)-xAddValue-55;
    float nl_height=nl_xy.get(j+1)+100-yAddValue;
    float dis=10;
    fill(255);//白色で描画する宣言
    textSize(20);
    text("N", firstPos+dis*0, nl_height); // 表示するテキスト, x座標, y座標
    text("o", firstPos+dis*1, nl_height); // 表示するテキスト, x座標, y座標
    text("w", firstPos+dis*2, nl_height); // 表示するテキスト, x座標, y座標
    text("L", firstPos+dis*4, nl_height); // 表示するテキスト, x座標, y座標
    text("o", firstPos+dis*5, nl_height); // 表示するテキスト, x座標, y座標
    text("a", firstPos+dis*6, nl_height); // 表示するテキスト, x座標, y座標
    text("d", firstPos+dis*7, nl_height); // 表示するテキスト, x座標, y座標
    text("i", firstPos+dis*8, nl_height); // 表示するテキスト, x座標, y座標
    text("n", firstPos+dis*9, nl_height); // 表示するテキスト, x座標, y座標
    text("g", firstPos+dis*10, nl_height); // 表示するテキスト, x座標, y座標
  }*/
}
function cxcollision()
{
  for(var i=0;i<xy.length;i+=2)
  {
     if(posy+charSize[1]>xy[i+1] && posy<=xy[i+1])
     {
        //メインキャラ右端との衝突判定
        if(posx+charSize[0]>xy[i] && posx+charSize[0]<xy[i]+boxSize[0])
        {
          posx=posx-((posx+charSize[0])-xy[i]);
        }
        //メインキャラ左端との衝突判定
        if(posx>xy[i] && posx<xy[i]+boxSize[0])
        {
          posx=posx+(xy[i]+boxSize[0]-posx);
        }
     }
  }
 
}
//メインキャラのY移動時の衝突判定関数
function cycollision()
{

  underCollisionCheck=0;
  for(var i=0;i<xy.length;i+=2)
  {
    if((posx>=xy[i] && posx<xy[i]+boxSize[0])||(posx+charSize[0]>xy[i] && posx+charSize[0]<=xy[i]+boxSize[1]))
    {
      //メインキャラの底面の衝突判定
      if(posy+charSize[1]>xy[i+1] && posy+charSize[1]<xy[i+1]+boxSize[1])
      {
        posy=posy-((posy+charSize[1])-xy[i+1]);
        underCollisionCheck=1;
      }
      //メインキャラの上面の衝突判定
      if(xy[i+1]<posy && xy[i+1]+boxSize[1]>posy)
      {
        posy=posy+(xy[i+1]+boxSize[1]-posy);
      }
    }
  }
}
//敵キャラの衝突判定
function xcollision(xmove,x,y)
{
  //レンガとの衝突判定
  for(var i=0;i<xy.length;i+=2)
  {
    if(xy[i]==(x+xmove) && xy[i+1]==y)return 0;
  }
  return 1;
}
function deadMotion()
{
  for(var i=0;i<8;i++)
  {
	ctx.lineWidth=3;
	ctx.fillStyle = 'rgb(255, 255 ,255)';
	var alpha=1-(weight*2)/255;
	if(alpha <= 0)alpha=0;
	ctx.globalAlpha = alpha;
	ctx.beginPath();
	var arcx=deadPointx+20+weight*Math.cos((2*Math.PI/8)*i)-xAddValue;
	var arcy=deadPointy+20+weight*Math.sin((2*Math.PI/8)*i)-yAddValue;
	ctx.arc(arcx,arcy,8, 0, 2*Math.PI, true);
	ctx.stroke();
    weight+=0.4;
	ctx.lineWidth=0;
  }
  ctx.globalAlpha = 1;
}
function mikuDraw()
{
  //背景描画
  ctx.fillStyle = 'rgb(0, 0 ,0)';
  ctx.fillRect(0,0,1000,600);
  
  if(menuMode==0 && mode==0 && ifHighlited==0)
  {
    //マウスが押されてる間の処理------------------------------------------
    if (mousePressed == 1 && boxAddFlag == 1)//レンガを配置する場合
    {
      xy.push(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]);
      xy.push(mouseY+yAddValue-(mouseY+yAddValue)%boxSize[1]);
    }
    else if(mousePressed == 1 && boxEraseFlag==1)//レンガを消す場合
    {
      eraseBox();
    }
    //-------------------------------------------------------------------
  }

  //NowLoadingの表示---------------------------------------------------
  nowLoading();
  
  //キャラの移動に伴って画面もスライドさせる---------------------------
  //x座標の移動--------------------------------------------------------
  if(posx>width/2)
  {
    xAddValue=posx-width/2;//x軸方向にズラす距離を，メインキャラが画面中心から行き過ぎた距離に設定
  }
  if(posx<0)posx=0;//メインキャラが画面左端より行き過ぎた場合に戻す
  //-------------------------------------------------------------------
  //y座標の移動--------------------------------------------------------
  if(posy<30)
  {
    yAddValue=posy-30;
  }
  if(deadFlag==0)
  {
    //rlフラグが0の場合，右向きのメインキャラを配置
    if(rlFlag==0)ctx.drawImage(img_R_char, posx-xAddValue, posy-yAddValue, charSize[0],charSize[1]);
    //rlフラグが1の場合，左向きのメインキャラを配置
    else if(rlFlag==1)ctx.drawImage(img_L_char, posx-xAddValue, posy-yAddValue, charSize[0],charSize[1]);
  }
  //-------------------------------------------------------------------
  //レンガの描画----------------------------------------------------
  for(var i=0;i<xy.length;i+=2)
  {
	 ctx.drawImage(img_block, xy[i]-xAddValue, xy[i+1]-yAddValue);
  }
  //GOALの描画----------------------------------------------------
  for(var i=0;i<goal.length;i+=2)
  {
	 ctx.drawImage(img_goal, goal[i]-xAddValue, goal[i+1]-yAddValue,40,80);
  }
  //敵キャラの描画--------------------------------------------------
  for(var i=0;i<monster.length;i+=2)
  {
    //画像の配置
    ctx.drawImage(img_nico,monster[i]+monsterx[i/2]-xAddValue,monster[i+1]-yAddValue,40,40);

    if(xcollision(40,monster[i]+monsterx[i/2],monster[i+1])==0)
    {
      minusFlag.splice(i/2,1,1);
      plusFlag.splice(i/2,1,0);
    }
    if(xcollision(-40,monster[i]+monsterx[i/2],monster[i+1])==0)
    {
      plusFlag.splice(i/2,1,1);
      minusFlag.splice(i/2,1,0);
    }
    if(minusFlag[i/2]==1)monsterx.splice(i/2,1,monsterx[i/2]-2);
    if(plusFlag[i/2]==1)monsterx.splice(i/2,1,monsterx[i/2]+2);
  }
  //メインキャラのx方向への移動-------------------------------------
  if(xmoveCount!=-1)
  {
    posx+=rl*xArray[xmoveCount];//移動距離をあらかじめ作った配列から取得し，左右の進む方向の±1を掛ける
    xmoveCount++;//配列のカウントを1上げる
    if(xmoveCount==xArray.length-1)xmoveCount=-1;//移動距離がMAXになったらこれ以上，移動しないようにcount値を-1に設定
    cxcollision();//x方向に動かした直後の座標で衝突判定(1回目)
  }
  //----------------------------------------------------------------
  //メインキャラのy方向の移動---------------------------------------
  posy=posy+8;  //gravity
  if(ymoveCount!=-1)
  {
    posy=posy-jArray[ymoveCount];  //jump & collision
    ymoveCount++;
    if(ymoveCount==jArray.length-1)ymoveCount=-1;  //jump stop
  }
  //前ループ時の値を保存
  preUnderCollisionCheck=underCollisionCheck;
  //yを動かした直後で衝突判定(2回目)
  cycollision();
 
  //敵とのあたり判定
  for(var i=0;i<monster.length;i+=2)
  {
      if(monster[i]+monsterx[i/2]<=posx+40 && monster[i]+monsterx[i/2]>=posx && monster[i+1]<=posy+40 && monster[i+1]>=posy)
      {
        if(deadFlag==0)
        {
          deadPointx=posx;
          deadPointy=posy;
        }
        if(clearFlag==0)deadFlag=1;
      }
  }
  //GOALとのあたり判定
  for(var i=0;i<goal.length;i+=2)
  {
      if(goal[i]<=posx+40 && goal[i]>=posx && goal[i+1]+80>=posy && goal[i+1]<=posy)
      {
        if(clearFlag==0 && deadFlag==0)
        {
          clearFlag=1;
          clearTime=Date.now()/1000;
        }
      }
  }
  //画面見切れラインに落ちたらGameOverを表示
  if(posy>height || deadFlag==1)
  {
    if(clearFlag==0)
    {
	  ctx.fillStyle = 'rgb(255, 255 ,255)';
	  ctx.font = 'italic 400 120px/2 Unknown Font, sans-serif';
	  ctx.fillText("GAME OVER", 165,height/2);
    }
  }
  if(clearFlag==1)
  {
    ctx.fillStyle = 'rgb(255, 255 ,255)';
    ctx.font = 'italic 400 120px/2 Unknown Font, sans-serif';
    ctx.fillText("GAME CLEAR!",85,height/2);
  }
  if(deadFlag==1)
  {
    deadMotion();
  }
  //前ループ時の値を保存
  prePosY=posy;

  if(mode==0)
  {
	ctx.fillStyle = 'rgb(125, 125 ,125)';
	var buf=highlightButton(450,0,60,60,5);
    if(buf==1)
    {
       saveFlag=1;
       menuMode=1;
    }
    else 
    {
      saveFlag=0;
      menuMode=0;
    }
	ctx.fillStyle = 'rgb(255, 255 ,255)';
    ctx.font = 'italic 400 22px/2 Unknown Font, sans-serif';
    ctx.fillText("Save",454,35);

	ifHighlited=0;
	ctx.fillStyle = 'rgb(125, 125 ,125)';
	buf=highlightButton(530,0,60,60);
	if(buf==1)hightlitedItem=0;
	ctx.drawImage(img_block,541,10,boxSize[0],boxSize[1]);
	ctx.fillStyle = 'rgb(125, 125 ,125)';
	buf=highlightButton(595,0,60,60,5);
	if(buf==1)hightlitedItem=1;
	ctx.drawImage(img_nico,606,10,boxSize[0],boxSize[1]);
	ctx.fillStyle = 'rgb(125, 125 ,125)';
	buf=highlightButton(660,0,60,60,5);
	if(buf==1)hightlitedItem=2;
	ctx.drawImage(img_eraser,671,10,boxSize[0],boxSize[1]);
	ctx.fillStyle = 'rgb(125, 125 ,125)';
	buf=highlightButton(725,0,60,60,5);
	if(buf==1)hightlitedItem=3;
	ctx.drawImage(img_goal,736,10,boxSize[0],boxSize[1]);
/*
	ctx.fillStyle = 'rgb(125, 125 ,125)';	
	buf=highlightButton(790,0,60,60,5);
	if(buf==1)hightlitedItem=4;
	ctx.drawImage(img_nowloading,801,10,boxSize[0],boxSize[1]);
*/
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.lineWidth=6;
	ctx.strokeRect(530+leftClickVar*65,0,60,60);
	ctx.lineWidth=0;
  }

  if(mode==1)
  {
    var nowTime = Date.now()/1000; 
	ctx.fillStyle = 'rgb(255, 255 ,255)';
    var timer = parseInt(20-(nowTime-gameStartTime));
    if(timer<=0)
    {
      if(deadFlag==0 && clearFlag!=1)
      {
        deadPointx=posx;
        deadPointy=posy;
        deadFlag=1;
      }
      timer=0;
    }
    if(clearFlag==1)
    {
      timer=parseInt(20-(clearTime-gameStartTime)); 
    }
	ctx.fillStyle = 'rgb(255, 255 ,255)';
    ctx.font = 'italic 400 25px/2 Unknown Font, sans-serif';
    ctx.fillText("Time:"+timer,800,25);
  }
  topMenuButton();
}
function addMonster()
{
    monster.push(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]);
    monster.push(mouseY-mouseY%boxSize[1]);
    monsterx.push(0);
    plusFlag.push(1);
    minusFlag.push(0); 
}
function addGoal()
{
  if(goal.length!=0)
  {
    goal.splice(0,1,mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]);
    goal.splice(1,1,1.0*(mouseY-mouseY%boxSize[1]));
  }
  else
  {
    goal.push(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]);
    goal.push(mouseY-mouseY%boxSize[1]);
  }
  test++;

}
function draw()
{
	if(game==0)gameSelect();
	if(game==1)mikuDraw();
	if(game==2)playGame();
}
function mouseMove(e) 
{
	var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}
function setFlag(num)
{
	boxAddFlag=0;
    loadingFlag=0;
	boxEraseFlag=0;
    loadingFlag=0;
	goalFlag=0;
	if(num==0)boxAddFlag=1;
	if(num==1)boxAddFlag=0;
	if(num==2)boxEraseFlag=1;
	if(num==3)goalFlag=1;
	if(num==4)loadingFlag=1;
	
}
function onClick(e) 
{
	leftClickVar=hightlitedItem;
    if(leftClickVar==0)
    {
		setFlag(0);
    }
    else if(leftClickVar==1)
    {
        setFlag(1);
      if(menuMode==0&&mode==0&&ifHighlited==0)addMonster();
    }
    else if(leftClickVar==2)
    {
		setFlag(2);
    }
    else if(leftClickVar==3)
    {
		setFlag(3);
        if(menuMode==0&&mode==0&&ifHighlited==0)addGoal();
    }
    else if(leftClickVar==4)
    {
		setFlag(4);
      if(menuMode==0 && mode==0 && ifHighlited==0)
      {
        nl_xy.push(mouseX+xAddValue-(mouseX+xAddValue)%boxSize[0]);//x座標
        nl_xy.push(mouseY-(mouseY+yAddValue)%boxSize[1]);//y座標
        nl_xy.push(0);//角度変化情報
      }
    }
    if(saveFlag==1)saveScene();
    if(createGameFlag==1)
    {
      game=1;
      createGameFlag=0;
      mode=0;
    }
    if(playGameFlag==1)
    {
      game=2;
      playGameFlag=0;
    }
    if(game==2 && stageNum!=-1)
    {
      mode=1;
      loadMikuDraw(stageNum);
      stageNum=-1;
    }
    if(topMenuFlag==1)
    {
      resetGame();
      game=0;
      topMenuFlag=0;

    }
	mousePressed=0;
}
//キーボードが押された時の処理
function keydownfunc(e)
{
	e.preventDefault();
	//どのキーが押されたかの情報を取得する
	var code = e.keyCode;
	if(deadFlag==0)
	{
		//スイッチ文でケースにより処理を変える
		switch (code) 
		{
			case 37://←キーが押された場合の番号
			  rlFlag=1;
			  xmoveCount=0;
			  rl=-1;
			  break;
			case 39://→キーが押された場合の番号
			  rlFlag=0;
			  xmoveCount=0;
			  rl=1;
			  break;
			case 38://↑キーが押された場合の番号
			  if(ymoveCount==-1 && underCollisionCheck==1)ymoveCount=0;
			  break;
			case 40://↓キーが押された場合の番号
			  break;
		}
	}
	return false;
}