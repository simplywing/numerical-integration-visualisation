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
scope.interval1 = 3.141;
scope.interval2 = 11;
scope.zoom = 80;
scope.intervalCheckbox = true;

function getFunctionResult(num, type, typeArgs){
    if(type === 3){
        return -Math.sin(num/scope.zoom * (1/typeArgs.xScaling)) * typeArgs.yScaling * scope.zoom * 0.01
    }
}

function line(startx, starty, endx, endy, width, style, context){
    context.lineWidth = width;
    context.strokeStyle = style;
    context.beginPath();
    context.moveTo(startx, starty);
    context.lineTo(endx, endy);
    context.stroke();
}

function setup(){
    ctx.font = '10px sans-serif';
    ctx.translate(0, ch / 2);
}

function draw(){
    //clear
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, -ch / 2, cw, ch);

    //scope.zoom rastering X
    for(let i = 0; i < cw; i += parseInt(scope.zoom)){
        line(i, -ch/2, i , ch/2, 1, "rgba(255,255,255,0.4)", ctx);
    }

    //scope.zoom rastering Y
    for(let i = 0; i < ch/2; i += parseInt(scope.zoom)){
        line(0, i, cw, i, 1, "rgba(255,255,255,0.4)", ctx);
    }
    for(let i = 0; i > -ch/2; i -= parseInt(scope.zoom)){
        line(0, i, cw, i, 1, "rgba(255,255,255,0.4)", ctx);
    }

    //function
    for(let i = 0; i < cw; i++){
        let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
        let h = getFunctionResult(i, 3, args);
        line(i, 0, i, h, 1, "white", ctx);
    }

    //Bin rastering
    let bin = parseInt(scope.bin);
    // for(let i = 0; i < cw; i +=bin){
    //     line(i, -ch/2, i, ch/2, 1, "rgba(255,0,0,0.2)", ctx);
    // }

    //pillars
    // for(let i = -bin/2; i < cw; i +=bin){
    //     let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
    //     let h = getFunctionResult(i, 3, args);

    //     //pillar fill
    //     ctx.fillStyle = "rgba(255,0,0,0.5)";
    //     ctx.fillRect(i-bin/2, 0, bin, h);

    //     //lines, left & right
    //     line(i-bin/2, 0, i-bin/2, h, 3, "rgb(255,0,0)", ctx);
    //     line(i+bin/2, 0, i+bin/2, h, 3, "rgb(255,0,0)", ctx);

    // }

    //pillars Fullscreen
    // let binSize = cw / bin;
    // for(let i = -binSize/2; i < cw; i += binSize){
    //     let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
    //     let h = getFunctionResult(i, 3, args);

    //     //pillar fill
    //     ctx.fillStyle = "rgba(255,0,0,0.5)";
    //     ctx.fillRect(i-binSize/2, 0, binSize, h);

    //     //lines, left & right
    //     line(i-binSize/2, 0, i-binSize/2, h, 3, "rgb(255,0,0)", ctx);
    //     line(i+binSize/2, 0, i+binSize/2, h, 3, "rgb(255,0,0)", ctx);

    // }

    //pillars inside Interval
    let binRange = (scope.interval2 - scope.interval1) * scope.zoom;
    let binSize = binRange / bin;
    let binStart = scope.interval1 * scope.zoom;
    for(let i = binSize/2 + binStart; i < binRange + binStart; i += binSize){
        let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
        let h = getFunctionResult(i, 3, args);

        if(scope.intervalCheckbox){
            //pillar fill
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(i-binSize/2, 0, binSize, h);

            //lines, left & right
            line(i-binSize/2, 0, i-binSize/2, h, 2, "rgb(255,0,0)", ctx);
            line(i+binSize/2, 0, i+binSize/2, h, 2, "rgb(255,0,0)", ctx);
        }
    }


    //Interval
    if(scope.intervalCheckbox){
        let xPosInterval1 = parseInt(scope.interval1 * scope.zoom);
        let xPosInterval2 = parseInt(scope.interval2 * scope.zoom);
        line(xPosInterval1, -ch/2, xPosInterval1, ch/2, 1, "rgb(0,0,255)", ctx);
        line(xPosInterval2, -ch/2, xPosInterval2, ch/2, 1, "rgb(0,0,255)", ctx);
    
        ctx.fillStyle = "rgba(0,0,255,0.25)";
        ctx.fillRect(xPosInterval1, -ch/2, xPosInterval2 - xPosInterval1, ch);    
    }

    window.requestAnimationFrame(draw);
}

setup();
draw();