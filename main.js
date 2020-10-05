let mainCanvas = document.getElementById("mainCanvas");
mainCanvas.width  = window.innerWidth;
mainCanvas.height = window.innerHeight;

let ctx = mainCanvas.getContext("2d");
let ch = mainCanvas.height;
let cw = mainCanvas.width;

let grundfunktion = 3;

scope.bin = 40;
scope.xscaling = 50;
scope.yscaling = 50;
scope.interval1 = 3.141;
scope.interval2 = 11;

scope.valueA = -3;
scope.valueB = 4;
scope.valueC = -2;
scope.valueD = -2;

scope.zoom = 60;
scope.intervalCheckbox = true;

/*Output fields*/
let calcArea = document.getElementById("calcArea");
let intArea = document.getElementById("intArea");
let diffPercent = document.getElementById("diffPercent");

let CalcBinArea = 0;
let intAreaVal = 0;
let diffPercentageVal = 0;

function getFunctionResult(num, typeArgs){
    let A = parseInt(scope.valueA);
    let B = parseInt(scope.valueB);
    let C = parseInt(scope.valueC);
    let D = parseInt(scope.valueD);

    let type = parseInt(document.getElementById("grundfunktion").value);

    if(type === 7){
        return -Math.sin(num/scope.zoom * (1/typeArgs.xScaling)) * typeArgs.yScaling * scope.zoom * 0.01
    }
    else if(type === 1){
        //Linear
        return A * num + D;
    }
    else if(type === 2){
        //Quadratisch
        //return A * Math.pow(num - B, 2) + D
        return A * Math.pow(num * (0.05) - B, 2) + D;
    }
    else if(type === 3){
        //Trigonometrisch
        //return C * Math.sin(A * (num - B)) + D
        return C * 60 * Math.sin(A * 0.01 * (num - B * 50)) + D * 50;
    }
    else if(type === 4){
        //Exponentiell
        return C * Math.pow(Math.E, A * 0.01 * (num - B * 50)) + D * 70;
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
        let h = getFunctionResult(i, args);
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
    //     let h = getFunctionResult(i, args);

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
    //     let h = getFunctionResult(i, args);

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
    CalcBinArea = 0;
    intAreaVal = 0;
    diffPercentageVal = 0;
    
    for(let i = binSize/2 + binStart; i < binRange + binStart; i += binSize){
        let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
        let h = getFunctionResult(i, args);

        if(scope.intervalCheckbox){
            //pillar fill
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(i-binSize/2, 0, binSize, h);
            CalcBinArea += ((binSize / scope.zoom) * (-h / scope.zoom)) ;

            //lines, left & right
            line(i-binSize/2, 0, i-binSize/2, h, 2, "rgb(255,0,0)", ctx);
            line(i+binSize/2, 0, i+binSize/2, h, 2, "rgb(255,0,0)", ctx);
        }
    }
    //calculate pseudo acurate Integral (pixel by pixel)
    for(let i = binStart; i < binRange + binStart; i += 1){
        let args = {yScaling: (scope.yscaling/50) * 300, xScaling: scope.xscaling/50};
        let h = getFunctionResult(i, args);

        if(scope.intervalCheckbox){
            intAreaVal += ((1 / scope.zoom) * (-h / scope.zoom)) ;
        }
    }

    calcArea.innerText = Math.round(CalcBinArea * 1000) /1000;
    intArea.innerText = Math.round(intAreaVal * 1000) /1000;
    diffPercentageVal = (100 / intAreaVal * CalcBinArea) - 100;
    diffPercent.innerText = Math.round(diffPercentageVal * 1000) /1000;
    

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