


(function() {
    
    var TIME_SCALE = 16;
    var X_GRID = 2;
    var Y_GRID = 2;
    
    Tangle.views.v_wavePlot = function (value, el, worksheet) {
            
        console.log('6 - wavePlot');
        var canvasWidth = el.get("width");
        var canvasHeight = el.get("height");
        var ctx = el.getContext("2d");

//        console.log('views:' + worksheet);

        var xVal = worksheet.getValue("ed0");
        console.log('xVal:', xVal);

        ctx.fillStyle = "#f00";
        var randX = Math.floor(Math.random() * canvasWidth);
        //        ctx.fillRect(0, 0, randX, 10);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = "#ddd";
        // add vertical grid lines
        for (var x = 0; x <= canvasWidth; x += X_GRID * canvasWidth / TIME_SCALE) {
            ctx.fillRect(x, 0, 1, canvasHeight);
        }
        // add horizontal grid lines
        for (var y = canvasHeight; y >= 0; y -= Y_GRID * canvasHeight / TIME_SCALE) {
            ctx.fillRect(0, y - 1, canvasWidth, 1);
        }
        

        // TODO move as input
        var testTime = 3;
        
        
        for (var x = 0; x < canvasWidth; x++) {
            
            
            var dist = arguments.callee.getDistanceForX(x, canvasWidth);
            if(Math.round(dist) == Math.round(xVal)) {
                var sliderX = arguments.callee.getXForDistance(xVal, canvasWidth);
                var thickness = 2;

                var timeP = Math.sqrt(dist);
                var yP = timeP / TIME_SCALE * canvasHeight;
                var testTimeTranslated = testTime / TIME_SCALE * canvasHeight;

                // determine if user guess is accurate
                var tolerance = 0.05;
                var isLinedUp = false;
                var timeP = arguments.callee.getPWaveFunction(dist);
                var timeS = arguments.callee.getSWaveFunction(dist);
                if (timeP + testTime >=  timeS - tolerance && timeP + testTime <= timeS + tolerance) {
                    isLinedUp = true;
                }
                
                // green
                ctx.fillStyle = isLinedUp ? "#286" : "#F00";
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
        return x/canvasWidth * TIME_SCALE;
    };
    
    Tangle.views.v_wavePlot.getXForDistance = function(distance, canvasWidth) {
        return distance / TIME_SCALE * canvasWidth;
    };
    

})();
