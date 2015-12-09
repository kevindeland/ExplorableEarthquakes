


(function() {

    Tangle.formatters.format_dist = function (value) {
        return "" + 1000 * value.round(3) + " km";
    };
    
    var TIME_SCALE = 24.0;
    var DIST_SCALE = 10;
    var X_GRID = 0.5;
    var Y_GRID = 1;

    var P_WAVE_COLOR = "#444";
    var S_WAVE_COLOR = "#888";
    
    Tangle.views.v_wavePlot = function (value, el, worksheet) {
            
//        console.log('6 - wavePlot');
        var canvasWidth = el.get("width");
        var canvasHeight = el.get("height");
        var ctx = el.getContext("2d");

//        console.log('views:' + worksheet);

        var xVal = worksheet.getValue("ed0");
//        console.log('xVal:', xVal);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = "#bbb";
        var labelBuffer = 2;
        // add vertical grid lines
        var even = false; // only label every other
        for (var x = 0; x <= canvasWidth; x += X_GRID * canvasWidth / DIST_SCALE) {
            even = !even;
            ctx.fillRect(x, 0, 1, canvasHeight);
            ctx.font = "12px Arial";
            var val = Math.round(arguments.callee.getDistanceForX(x, canvasWidth) * 2) / 2;
            if(even)
                ctx.fillText("" + val, x + labelBuffer, canvasHeight - labelBuffer);
        }
        // last line
        ctx.fillRect(canvasWidth - 1, 0, canvasWidth, canvasHeight);
        
        // add horizontal grid lines
        even = true;
        for (var y = canvasHeight; y >= 0; y -= Y_GRID * canvasHeight / TIME_SCALE) {

            ctx.fillRect(0, y - 1, canvasWidth, 1);
            ctx.font = "12px Arial";
            var val = Math.round(arguments.callee.getTimeForY(y, canvasHeight));
            if(even)
                ctx.fillText("" + val, 0 + labelBuffer, canvasHeight - y - labelBuffer);
            even = !even;
        }
        ctx.fillRect(0, 0, canvasWidth, 1);

        // TODO move as input
        var timeDiff = worksheet.getValue("td");


        var thickness = 2;

        // draw legend
        var legendLineThickness = 4;
        var legendCoords = {x: {min: 380, max: 480}, y: {min: 10, max: 70}};
        ctx.fillStyle = "#EEE";
        ctx.lineStyle = "#222";
        ctx.rect(380, 20, 80, 50);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = P_WAVE_COLOR;
        ctx.fillRect(legendCoords.x.min + 5, legendCoords.y.min + 25, 10, thickness);
        ctx.fillStyle = S_WAVE_COLOR;
        ctx.fillRect(legendCoords.x.min + 5, legendCoords.y.min + 45, 10, thickness);
        ctx.fillStyle = "#000";
        ctx.fillText("P-wave", legendCoords.x.min + 25, legendCoords.y.min + 30);
        ctx.fillText("S-wave", legendCoords.x.min + 25, legendCoords.y.min + 50);
        
                
        for (var x = 0; x < canvasWidth; x++) {
            
            var dist = arguments.callee.getDistanceForX(x, canvasWidth);
            
            if(false && (Math.round(dist * 10) / 10) == (Math.round(xVal * 10) / 10)) {
///                console.log('rounded: ' + Math.round(dist) + ',' + Math.round(xVal));
                //                console.log('drawing line at ' + dist + ' and ' + xVal);
                var sliderX = arguments.callee.getXForDistance(xVal, canvasWidth);
                var thickness = 4;

//                var timeP = Math.sqrt(dist);
                var yP = timeP / TIME_SCALE * canvasHeight;
                var testTimeTranslated = timeDiff / TIME_SCALE * canvasHeight;

                // determine if user guess is accurate
                var tolerance = 0.025;
                var isLinedUp = false;
                var timeP = arguments.callee.getPWaveFunction(dist);
                var timeS = arguments.callee.getSWaveFunction(dist);

                var yP = arguments.callee.getYForTime(timeP, canvasHeight);
                
                var correctDist = arguments.callee.solveForDistance(timeDiff);
//                console.log('correctDist: ' + correctDist);
                var exactPixelToHighlight = Math.ceil(arguments.callee.getXForDistance(correctDist, canvasWidth));
//                console.log('this pixel: ' + x + '; exact pixel ' + exactPixelToHighlight);
//                if (x == exactPixelToHighlight) {
                if (timeP + timeDiff >=  timeS - tolerance && timeP + timeDiff <= timeS + tolerance) {
                    isLinedUp = true;
                }
                
                // green
                ctx.fillStyle = isLinedUp ? "rgb(32, 128, 96)" : "rgb(255, 0, 0)";
                //                ctx.fillStyle = isLinedUp ? "#286" : "#F00";
//                testTimeTranslated = 40;
                var topOfLine = canvasHeight - yP - testTimeTranslated;// - yP - testTimeTranslated;
//                console.log(testTimeTranslated);
//                console.log(yP);
                ctx.fillRect(sliderX - thickness / 2, topOfLine, thickness, testTimeTranslated);
                
            }
            
                        // only draw up to cursor
// TODO uncomment            if(dist > xVal) return;

            var timeP = arguments.callee.getPWaveFunction(dist);
            var timeS = arguments.callee.getSWaveFunction(dist);

            var yP = timeP / TIME_SCALE * canvasHeight;
            var yS = timeS / TIME_SCALE * canvasHeight;
            var thickness = 2;        
            // draw secondary line
            ctx.fillStyle = S_WAVE_COLOR;
            ctx.fillRect(x, canvasHeight - yS - thickness, 1, thickness);

            // draw primary line
            ctx.fillStyle = P_WAVE_COLOR;
            ctx.fillRect(x, canvasHeight - yP - thickness, 1, thickness);
            
        }

        // draw slider line
        console.log('distance:', xVal);
        // x value on canvas
        var xCanvas = arguments.callee.getXForDistance(xVal, canvasWidth);
        // time vars
        var timeP = arguments.callee.getPWaveFunction(xVal);
        var timeS = arguments.callee.getSWaveFunction(xVal);
        var td = timeS - timeP;
        
        var yP  = arguments.callee.getYForTime(timeP, canvasHeight);
        var yS =  arguments.callee.getYForTime(timeS, canvasHeight);
        
        var testTimeTranslated = timeDiff / TIME_SCALE * canvasHeight;

        var thickness = 4;
        var tolerance = 0.1;
        if (timeP + timeDiff >= timeS - tolerance && timeP + timeDiff <= timeS + tolerance) {
            ctx.fillStyle = "rgb(32, 128, 96)";
        } else {
            ctx.fillStyle = "rgb(255, 0, 0)";
        }
        ctx.fillRect(xCanvas - thickness/2, canvasHeight - yP - testTimeTranslated, thickness, testTimeTranslated);
        
            
    };

    // Tp = p(d) = sqrt(d)
    Tangle.views.v_wavePlot.getPWaveFunction = function(dist) {
        //        return Math.sqrt(dist);
        // used WolframAlpha to get "quadratic fit (0,0), (2,4) (4,7), (6, 9.5), (8, 11.3), (10, 13)"
        return (-0.0727679 * dist * dist) + (2.00482 * dist);// + 0.110714;
    };
    // Ts = s(d) = 2*sqrt(d)
    Tangle.views.v_wavePlot.getSWaveFunction = function(dist) {
        //        return 2 * Math.sqrt(dist);
        // used WolframAlpha to get "quadratic fit (0,0), (1,4), (3, 10), (5,15), (6,17), (9, 22.3), (10, 23)"
        return (-0.135248 * dist * dist) + (3.64334 * dist); // + 0.215587
    };
    // inverse of the above two
    // Td = s(d) - p(d) = 2sqrt(d) - sqrt(d) = sqrt(d)
    // d = Td^2
    Tangle.views.v_wavePlot.solveForDistance = function(timeDiff) {
        return timeDiff * timeDiff;
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

    Tangle.views.v_wavePlot.getYForTime = function(time, canvasHeight) {
        return time / TIME_SCALE * canvasHeight;
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
        var t0 = 0;
        var time = (Date.now() / 1000 ) % 200 * 2;

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
        var sensorX = 220;
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
