


(function() {
    
    var TIME_SCALE = 16;
    var DIST_SCALE = 16;
    var X_GRID = 2;
    var Y_GRID = 2;
    
    Tangle.views.v_wavePlot = function (value, el, worksheet) {
            
//        console.log('6 - wavePlot');
        var canvasWidth = el.get("width");
        var canvasHeight = el.get("height");
        var ctx = el.getContext("2d");

//        console.log('views:' + worksheet);

        var xVal = worksheet.getValue("ed0");
//        console.log('xVal:', xVal);

        ctx.fillStyle = "#f00";
        var randX = Math.floor(Math.random() * canvasWidth);
        //        ctx.fillRect(0, 0, randX, 10);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = "#bbb";
        var labelBuffer = 2;
        // add vertical grid lines
        for (var x = 0; x <= canvasWidth; x += X_GRID * canvasWidth / DIST_SCALE) {
            ctx.fillRect(x, 0, 1, canvasHeight);
            ctx.font = "12px Arial";
            var val = arguments.callee.getDistanceForX(x, canvasWidth);
            ctx.fillText("" + val, x + labelBuffer, canvasHeight - labelBuffer);
        }
        // last line
        ctx.fillRect(canvasWidth - 1, 0, canvasWidth, canvasHeight);
        
        // add horizontal grid lines
        for (var y = canvasHeight; y >= 0; y -= Y_GRID * canvasHeight / TIME_SCALE) {
            ctx.fillRect(0, y - 1, canvasWidth, 1);
            ctx.font = "12px Arial";
            var val = arguments.callee.getTimeForY(y, canvasHeight);
            ctx.fillText("" + val, 0 + labelBuffer, canvasHeight - y - labelBuffer);
        }
        ctx.fillRect(0, 0, canvasWidth, 1);

        // TODO move as input
        var timeDiff = worksheet.getValue("td");
        
        for (var x = 0; x < canvasWidth; x++) {
            
            var dist = arguments.callee.getDistanceForX(x, canvasWidth);
            if(Math.round(dist) == Math.round(xVal)) {
                var sliderX = arguments.callee.getXForDistance(xVal, canvasWidth);
                var thickness = 2;

                var timeP = Math.sqrt(dist);
                var yP = timeP / TIME_SCALE * canvasHeight;
                var testTimeTranslated = timeDiff / TIME_SCALE * canvasHeight;

                // determine if user guess is accurate
                var tolerance = 0.05;
                var isLinedUp = false;
                var timeP = arguments.callee.getPWaveFunction(dist);
                var timeS = arguments.callee.getSWaveFunction(dist);
                if (timeP + timeDiff >=  timeS - tolerance && timeP + timeDiff <= timeS + tolerance) {
                    isLinedUp = true;
                }
                
                // green
                ctx.fillStyle = isLinedUp ? "rgb(32, 128, 96)" : "rgb(255, 0, 0)";
//                ctx.fillStyle = isLinedUp ? "#286" : "#F00";
                ctx.fillRect(sliderX - thickness, canvasHeight - yP - testTimeTranslated, thickness, testTimeTranslated);
                
            }
            
            // only draw up to cursor
            if(dist > xVal) return;
            
            var timeP = arguments.callee.getPWaveFunction(dist);
            var timeS = arguments.callee.getSWaveFunction(dist);

            var yP = timeP / TIME_SCALE * canvasHeight;
            var yS = timeS / TIME_SCALE * canvasHeight;
            var thickness = 2;        
            // draw secondary line
            ctx.fillStyle = "#444";
            ctx.fillRect(x, canvasHeight - yS - thickness, 1, thickness);

            // draw primary line
            ctx.fillStyle = "#888";
            ctx.fillRect(x, canvasHeight - yP - thickness, 1, thickness);
            
        }
            
    };

    Tangle.views.v_wavePlot.getPWaveFunction = function(dist, time) {
        return Math.sqrt(dist);
    };

    Tangle.views.v_wavePlot.getSWaveFunction = function(dist, time) {
        return 2 * Math.sqrt(dist);
    };

    Tangle.views.v_wavePlot.getDistanceForX = function(x, canvasWidth) {
        return x/canvasWidth * DIST_SCALE;
    };
    
    Tangle.views.v_wavePlot.getXForDistance = function(distance, canvasWidth) {
        return distance / DIST_SCALE * canvasWidth;
    };

    Tangle.views.v_wavePlot.getTimeForY = function(y, canvasHeight) {
        return y / canvasHeight * TIME_SCALE;
    };


    var GROUND_WIDTH = 100;
    var GROUND_HEIGHT = 30;
    
    // for simulating waves
    Tangle.views.v_waveSim = function (value, el, worksheet) {

//        console.log('6 - waveSim');

        // get wave-type specified in html class name
        var waveType = el.className.split(' ')[1][2];
//        console.log(waveType);
        var canvasWidth = el.get("width");
        var canvasHeight = el.get("height");
        var ctx = el.getContext("2d");
        
        //var time = worksheet.getValue("simTime");
        var time = 350;

        var vp = 2.0;
        var vs = 1.0;
        
        var dp = vp * time;
        var ds = vs * time;
        
        // clear canvas
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        //
        var defaultGroundColor = arguments.callee.buildColor(0);
        
        // draw ground
        var buffer = 20;
        var groundWidth  = canvasWidth - 2 * buffer;
        var ratio = 1 / 10;
        var groundHeight = groundWidth * ratio;

        var wavelength = 80;
        var amplitude = 10;

        // drawing points
        var x0 = buffer;
        var xFinal = canvasWidth - buffer;
        var y0 = canvasHeight/2 - groundHeight/2;

        // draw ground incrementally
        for(var x = x0; x <= xFinal; x++) {
            if(waveType == 's' && x < ds && x > ds - wavelength) {
                ctx.fillStyle = defaultGroundColor;
                var y = y0 - amplitude * Math.sin(Math.PI * 2 * (x - ds) / wavelength);
                ctx.fillRect(x, y, 1, groundHeight);
            } else if (waveType == 'p' && x < dp && x > dp - wavelength) {
                var colorMultiplier = Math.sin(Math.PI * 2 * (x - dp) / wavelength);
                console.log(colorMultiplier);
                ctx.fillStyle = arguments.callee.buildColor(colorMultiplier);
                ctx.fillRect(x, y0, 1, groundHeight);
            } else { // default
                ctx.fillStyle = defaultGroundColor;//"rgb(128, 255, 128)";
                ctx.fillRect(x, y0, 1, groundHeight);
            }
            
        }
        
        // sensor info
        var sensorX = 300;
        var sensorY = y0 + groundHeight / 2;
        if(waveType == 's' && sensorX < ds && sensorX > ds - wavelength) {
            sensorY -= amplitude * Math.sin(Math.PI * 2 * (sensorX - ds) / wavelength) ;
        } else {
            
        }
        var sensorRadius = 5;
        var sensorColor = "#222";
        ctx.fillStyle = sensorColor;
        ctx.beginPath();
        ctx.arc(sensorX, sensorY, sensorRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        
//        ctx.fillStyle = "rgb(128, 128, 128)";
//        ctx.fillRect(buffer, canvasHeight/2 - groundHeight/2, groundWidth, groundHeight);
        
        ctx.lineStyle = "#000";
        ctx.rect(buffer, canvasHeight/2 - groundHeight/2, groundWidth, groundHeight);
        ctx.stroke();

    };

    // pressure ranges from -1 to 1
    Tangle.views.v_waveSim.buildColor = function(pressure) {
        var R = {min: 96, max: 128};
        var G = {min: 128, max: 256};
        var B = {min: 96, max: 128};

        function colorEval (pressure, color) {
            return Math.floor((color.max + color.min) / 2 + pressure * (color.max - color.min) / 2);
        }
        var r = colorEval(pressure, R);
        var g = colorEval(pressure, G);
        var b = colorEval(pressure, B);
                
        var string = "rgb(" + r + ", " + g + ", " +  b + ")";
        console.log(string);
        return string;
    };

    
    
})();
