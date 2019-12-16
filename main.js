let mainCanvas = document.getElementById("mainCanvas");
mainCanvas.width  = window.innerWidth;
mainCanvas.height = window.innerHeight;


let ctx = mainCanvas.getContext("2d");
let ch = mainCanvas.height;
let cw = mainCanvas.width;

let unit = 80

scope.bin = 40;
scope.xscaling = 50;
scope.yscaling = 50;

function getFunctionResult(num, type, typeArgs){
    if(type === 3){
        return -Math.sin(num/unit * (1/typeArgs.xScaling)) * typeArgs.yScaling
    }
}

function setup(){
    ctx.font = '10px sans-serif';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.translate(0, ch / 2);
}

function draw(){
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, -ch / 2, cw, ch);

    //Center Line
    // ctx.strokeStyle = "white";
    // ctx.beginPath();
    // ctx.moveTo(0,0);
    // ctx.lineTo(cw, 0);
    // ctx.stroke();

    //Unit rastering X
    for(let i = 0; i < cw; i +=unit){
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.moveTo(i, -ch/2);
        ctx.lineTo(i, ch/2);
        ctx.stroke();
    }

    //Unit rastering Y
    for(let i = 0; i < ch/2; i +=unit){
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(cw, i);
        ctx.stroke();
    }
    for(let i = 0; i > -ch/2; i -=unit){
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(cw, i);
        ctx.stroke();
    }

    //function
    for(let i = 0; i < cw; i++){
        let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
        let h = getFunctionResult(i, 3, args)

        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
    }

    //Bin rastering
    let interval = parseInt(scope.bin);
    // for(let i = 0; i < cw; i +=interval){
        
    //     //console.log(i);
    //     ctx.lineWidth = 1;
    //     ctx.strokeStyle = "rgba(255,0,0,0.2)";
    //     ctx.beginPath();
    //     ctx.moveTo(i, -ch/2);
    //     ctx.lineTo(i, ch/2);
    //     ctx.stroke();
    // }

    //pillars
    for(let i = -interval/2; i < cw; i +=interval){
        
        let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
        let h = getFunctionResult(i, 3, args)

        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.fillRect(i-interval/2, 0, interval, h)
        ctx.lineWidth = 3;

        //lines
        ctx.strokeStyle = "rgb(255,0,0)";
        //left
        ctx.beginPath();
        ctx.moveTo(i-interval/2, 0);
        ctx.lineTo(i-interval/2, h);
        ctx.stroke();
        //right
        ctx.beginPath();
        ctx.moveTo(i+interval/2, 0);
        ctx.lineTo(i+interval/2, h);
        ctx.stroke();
    }

    window.requestAnimationFrame(draw);
}

setup();
draw();