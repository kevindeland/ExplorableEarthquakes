


(function() {


    Tangle.views.v_freqPlot = function (value, el, worksheet) {
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
    };

    Tangle.views.v_freqPlot.getDistanceForX = function(x, canvasWidth) {
        return x/canvasWidth;
    };

/*    Tangle.views.v_wavePlot.getXForDistance = function(distance, canvasWidth) {
        return distance
    };
*/

    

})();
