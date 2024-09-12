import { createArray, max,min,localGet,localSet } from "./basic.js";
import { LevelMap } from "./map.js";

const doc = document
// Get canvas ID
const getCanvas = a => doc.getElementById(a);
const getContext = a => a.getContext('2d');

// Image
const createImg = _ =>new Image()
const toPng = a =>a.toDataURL()

const canvas = getCanvas('canvas')
const ctx = getContext(canvas);

// Draw Image  ( Main ) 
const canvasDraw=(f,a)=>{
    if(f)ctx.drawImage(f,a.x,a.y,a.w,a.h)
  }
const canvasMoveTo=a=>ctx.moveTo(a.x,a.y)
const canvasLineTo=a=>ctx.lineTo(a.x,a.y)
const canvasArcTo=(a,b,r)=>ctx.arcTo(a.x,a.y,b.x,b.y,r)
const canvasAlpha=a=>ctx.globalAlpha=a
const canvasFillStyle=a=>ctx.fillStyle='#'+ a
const canvasFillRect=(a,b)=>ctx.fillRect(a.x,a.y,b.x,b.y)
const canvasFill =_=>ctx.fill()
const canvasstrokeStyle=a=>ctx.strokeStyle='#'+ a
const canvasstrokeRect=(a,b)=>ctx.strokeRect(a.x,a.y,b.x,b.y)
const canvasStroke=_=>ctx.stroke()
const canvasglobalComposite=a=>ctx.globalCompositeOperation=a
const canvasSave=_=>ctx.save()
const canvasRestore=_=>ctx.restore()
const canvasBegin=_=>ctx.beginPath()
const canvasClose=_=>ctx.closePath()


const nN = [0,0,0],C = [0,1,0],T = [1,0,0],P = [0,0,1]

const blackColor = "333",whiteColor="fff",blueColor="065279",darkbule ='425066';

const Img = {
    // [0,0,0]
    tiles:[null],
    clickTiles:[],
    player:[],

    A2ZTile:{},
    ATB:{},
    item:{ //...createArray(17,"a78e44")
        color:[blackColor,"2a7",blackColor,whiteColor,"a84",blackColor,"bcb",'a00',"216","216","297",...createArray(4,whiteColor),"216","216"],
        count:[nN,nN,nN,nN,T,nN,nN,nN,T,T,C,C,C,C,C,P,P],
        pattern:[
            "p𡎁鉈饓乒𑁁ǀ", // 1 start 起點
            " ￰𝶀𝮻𸀷ǿ", // 2 終點
            " 𡿀🰿𼏸𿿧𤬤᤮", // 3 按鈕
            "௾윘𗖑𵫫𙄵̜࿺", // 12 回收歸零 > 4
            "𘐙؀𙠙𘙀ᤆ怘ၤ",// > 方向鍵 5-8
            "鿿퉙鏉驋𙉹鍉῿",// 9 Wall 
            "𕿿𝕝𕗕𕵗𝕵𕝕῿", // 10 Temp wall
            "᯾큜熑𱣣𙄱݁࿻",// 11 fail game
            "Ё𡿰𔤤𤌤𲤤𤡥ᔐ", // move 轉角
            "𦄤𡥂𔐤𔌘⒄𱡑ѐ", // move 直
            "𬁰𱣁𧍤릳𥅚Ҿ࿹", // home
            "𾀀𺁇𬹓𐕈𥻊𿢁", // return
            "萉Ȁ耈Ȁࠂ ဤ", // 選擇按鈕
            "耀̀．𿏾ฃ‌",// 箭頭 > 指向 2
            "𠀀ఀ𿰸𼿸㠏耰",// 箭頭 > 指向 1
            "𾀀𑥱꛹ꄤ𿓃🡥", // 插頭 直 1
            "𾀀𑩱쫲𒅌𿥂🡩",  // 插頭 直 2
        ]
    },
    font:{
        color1:createArray(40,'a78e44'),
        color2:createArray(40,'e29c45'),
        pattern: ["","𲅻𛴉","𒥎䀑","䘮䀑","𭙮","𡃄","𤘮🢍","𤘮𞣅","𺔩萣","𰘮","𸘮","𢈟䈐","𴘾","𴘾𐡃",'읮𑷾', '𼘯', '蘮', '옯', '𸘿🢅', '𸘿ႅ', '𨘮', '𼘱𑣇', '𡂎', '䈐쥊', '𺘱𑢤', '萡🂄', '흱𑣆', '홱𑣇', '옮', '𼘮ႅ', '옮🳖', '𼘯𑒕', '𰘮', '𡂟䈐', '옱', '옱䕆', '옱𑷖', '𢨱𑢨', '𢨱䈐', '𢈿🢈']
        //  "𲅻𛴉","𒥎䀑","䘮䀑" %!?
        //      "𭙮" 0
        //      "𡃄" 1
        // "𤘮🢍" 2
        // "𤘮𞣅" 3
        // "𺔩萣" 4
        // "𰘮" 5
        // "𸘮" 6
        // "𢈟䈐" 7
        // "𴘾" 8
        // "𴘾𐡃"  9
        //     "𢈿🢈", //Z
        //     "𢨱䈐", // Y
        //     "𢨱𑢨", // X
        //     "옱𑷖", // W
        //     "옱䕆", // V
        //     "옱", // U
        //     "𡂟䈐", // T
        //     "𰘮", // S
        //     "𼘯𑒕", //R
        //     "옮🳖", //Q
        //     "𼘮ႅ", //P
        //     "옮", // O
        //     "홱𑣇",// N
        //     "흱𑣆", //M
        //     "萡🂄", //L
        //     "𺘱𑢤", //K
        //     "䈐쥊",//j
        //     "𡂎", //I
        //     "𼘱𑣇", // H
        //     "𨘮", // G
        //     "𸘿ႅ", // F
        //     "𸘿🢅", // E
        //     "옯",// D
        //     "蘮", // C
        //     "𼘯",// B,
        //     "읮𑷾",// A
        // ]
    },
}

const GameBoardInit = {
    mw:0,
    mh:0,
    mis:300,
    level:0,
    player:null,
    
    tap:0,
    emerge:0,

    dragRect:null,
    dragNumber:0,
    dragCount:2,
    
    background: null,

    trans:{
        s:0,
        st:null,
        e:0,
        et:null
    },
    UI:{
        controler:[0,0,0],
        view:[]
    },

    meunMaxWidth:250,
    meunMaxheight:150,
    meunItemLenth:24,

    gm:[],

    dragMax:[],

    gameObject:[],
    dragObject:[],
    clickObject:[],
    historyMap:[],
    currentMap:[],
    
    RME:function(a){
        this.UI.controler=[...a]
        return [...a]
    },
    get gameStart(){
        return this.UI.controler.find(e=>e==1)
    },
    get fadeIn(){
        this.trans.s=1
        this.trans.e=0
        return 1
    },
    get fadeOut(){
        this.trans.s=0
        this.trans.e=1
        return 0
    },
    get cw(){
        return this.mw/2
    },
    get ch(){
        return this.mh/2
    },
    get mwl(){
        
        let maxa = 0
        this.currentMap.forEach(e=>{
            maxa = max(maxa,e.length)
        });

        return maxa
    },
    get mhl(){
        return this.currentMap.length
    },
    get grid(){
        let minWindow = min(this.mw,this.mh)
        let maxLength = max(this.mwl,this.mhl)+3
        return min(this.mis,minWindow/maxLength)
    },
    get gwh(){
        return {x:this.grid,y:this.grid}
    },
    get menuItemSize(){
        let x = min(this.meunMaxWidth,this.grid*1.5)
        let y = min(this.meunMaxheight,this.ch/(this.meunItemLenth/4))
        return {x,y}
    },
    get CurPos(){
        return {x:this.cw-this.mwl*this.grid/2,y:this.ch-this.mhl*this.grid/2}
    },
    get maxLgth(){
        return {x:this.mwl,y:this.mhl}
    }
}

const roundedRect = ({x, y, w, h},f=1,s=0,radius=5)=>{

    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()

    if(f)ctx.fill()
    if(s)ctx.stroke()
}

const arr1DTo2D = (arr, width, height) => Array.from({ length: height }, (_, i) => arr.slice(i * width, (i + 1) * width));

const string2Array = (str, color_bit, originalLength) => {
    let result = [];
    const color_space = (1 << color_bit) - 1;
    const max_bits = 18;
    const bit_size = max_bits / color_bit;

    [...str].forEach((char) => {
        let temp = char.codePointAt(0);

        for (let i = 0; i < bit_size; i++) {
            result.push(temp & color_space);
            temp >>= color_bit;
        }
    });

    return result.slice(0, originalLength);;
}

const tilePng =(str,color,w,h,stroke=0) =>{

    let arr = arr1DTo2D(string2Array(str,1,w*h),w,h)
    var b = doc.createElement('canvas')
    var ctx1 = getContext(b);

    const size = 16
      
    const widthSize = w*size
    const heightSize = h*size
    b.width = widthSize
    b.height = heightSize
    
    ctx1.clearRect(0,0,widthSize,heightSize)
    
    const edgeRect = (x,y)=>{
        const strokeVector = [
            {
                r:!arr[y][x-1],
                m:[0,0],
                l:[0,1]
            },
            {
                r:!arr[y][x+1],
                m:[1,0],
                l:[1,1]
            },
            {
                r:!arr[y-1]||!arr[y-1][x],
                m:[0,0],
                l:[1,0]
            },
            {
                r:!arr[y+1]||!arr[y+1][x],
                m:[0,1],
                l:[1,1]
            }
        ]
        strokeVector.forEach(e=>{
            if(e.r){
                ctx1.beginPath()
                ctx1.lineWidth = 5
                ctx1.strokeStyle = "#ccc"
                ctx1.moveTo((x+e.m[0])*size,(y+e.m[1])*size)
                ctx1.lineTo((x+e.l[0])*size,(y+e.l[1])*size)
                ctx1.stroke()
            }
        })
    }

    for(var i=0;i<h;i++){
        for(var j=0;j<w;j++){
            let value = arr[i][j]
            if(value){
                ctx1.fillStyle="#"+color
                ctx1.fillRect(j*size,i*size,size,size)
                if(stroke){
                    edgeRect(j,i)
                }
            }
            
        }
    }
    
    return new Promise((resolve) => {
        let basicImage = createImg();
        basicImage.src = toPng(b);
        basicImage.onload = () => resolve(basicImage);
    });
}

const createFontTile = async (pattern, colors,cont=0) => {
    // Draw font
    const alphabet = ' %!?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // A 2 Z

    return Object.fromEntries(
        await AwaitPromise(
            alphabet.split('').map((letter, index) =>
                tilePng(pattern[index], colors[index], 5, 7, cont).then(result => [letter, result])
            )
        )
    );
};

const rotateImage=(image, angle)=>{

    var canvas = doc.createElement('canvas');
    var ctx = getContext(canvas);
  
    var width = image.width;
    var height = image.height;
    var radians = (angle * Math.PI) / 180;
  
    canvas.width = width;
    canvas.height = height;
  
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radians);
    ctx.drawImage(image, -width / 2, -height / 2);
  
    return new Promise((resolve) => {
        let basicImage = createImg();
        basicImage.src = toPng(canvas);
        basicImage.onload = () => resolve(basicImage);
    });;
}

const PowerDraw = (x,y,w,h,p,c="888",v=0)=>{
    canvasSave()
    canvasstrokeStyle(c)
    roundedRect({x,y,w,h},0,1)
    canvasFillStyle(c)
    roundedRect({x:x+w+10,y:y+h/4,w:w/8,h:h/2},1)
    canvasRestore()
}

const AwaitPromise = async (f)=>{
    return await Promise.all(f)
}

const Loading =async () =>{
    GameBoardInit.mw = canvas.width = window.innerWidth
    GameBoardInit.mh = canvas.height = window.innerHeight
    
    const bt = localGet("bt")
    const gm = localGet("gm")

    GameBoardInit.emerge = bt?+bt:13
    GameBoardInit.gm = gm? JSON.parse(gm):createArray(LevelMap.length,0)

    Img.A2ZTile = await createFontTile(Img.font.pattern, Img.font.color1);
    Img.ATB = await createFontTile(Img.font.pattern, Img.font.color2,1);
    
    // Draw tiles
    const tempTile = await AwaitPromise(Img.item.pattern.map((e,i)=>tilePng(e,Img.item.color[i],11,11)))
     
    // rotate tiles
    const angle = [0,180,270,90]
    
    const arrowDirect = await AwaitPromise(angle.map(ang=>rotateImage(tempTile[4],ang)))

    return new Promise(async (r) => {
        const promises = tempTile.map(async (e,i)=>{
            const tempCo = Img.item.count[i]
            if(tempCo==nN||i==4){

                if(i==4){
                    Img.tiles = Img.tiles.concat(arrowDirect)
                }else{
                    Img.tiles.push(e)
                }

            }else{
                const rotateTiles = await AwaitPromise(angle.map(ang=>rotateImage(e,ang)))
                if(tempCo==C){
                    Img.clickTiles=Img.clickTiles.concat(rotateTiles)
                }
                if(tempCo==T){
                    Img.tiles = Img.tiles.concat(rotateTiles)
                }
                if(tempCo==P){
                    Img.player= Img.player.concat(rotateTiles)
                }
            }
        })
        await AwaitPromise(promises);
        r()
    });
}

export { 
    canvas,
    ctx,
    GameBoardInit,
    Img,
    darkbule,
    blueColor,
    canvasDraw,
    canvasSave,
    canvasAlpha,
    canvasBegin,
    canvasClose,
    canvasArcTo,
    canvasRestore,
    canvasFill,
    canvasFillStyle,
    Loading,
    roundedRect,
    PowerDraw
}