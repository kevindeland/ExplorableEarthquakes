//
//  c_filterParams.js


Tangle.controls.c_xKnob = function(el, worksheet) {
//    console.log('2 - in wave knob');
    
    var name = worksheet.getVariableName(el);

    var xParameter = "ed0";
    var xBounds = { min:0, max:16 };

    var yParameter = "tt0"
    var yBounds = { min:0, max:8 };


    function getTTForY (y) {
        return ( (canvasHeight - y) / canvasHeight) * (yBounds.max - yBounds.min) + yBounds.min ;
    }
    //    console.log(worksheet.getValue("xVal"));


    el.setStyles({position: "absolute", left: 0, top: 0});

    var canvasEl = el.getParent().getElement("canvas");
    var canvasWidth = canvasEl.get("width");
    var canvasHeight = canvasEl.get("height");

    var lineStyle = "position:absolute; display:block; border-left:1px dotted #00f; pointer-events:none; top:20px; width:1px; h\
eight:" + canvasHeight + "px;";
    var lineEl = new Element("div", { style:lineStyle });
    el.grab(lineEl, "bottom");
    
    var knobStyle = "position:absolute; display:none; ";
    var knobWidth = 36, knobHeight = 36;
    var knobEl = new Element("img", { style:knobStyle, src:"http://worrydream.com/ExplorableExplanations/Media/Filter\
ParamsKnob.png", width:knobWidth, height:knobHeight });

    el.grab(knobEl, "bottom");

    var knobX, knobY;

/*    console.log('el');
    console.log(el);
    console.log(worksheet);
    console.log(worksheet.setView);
 */   knobX = 10;
    knobY = 8;
    // TODO why is this not being called?
    worksheet.setView(el, function () {
//        console.log('7 - setting view');

        var dist = worksheet.getValue(xParameter);
//        console.log(dist);
        // set knob X and Y values
        knobX = Math.round(Tangle.views.v_wavePlot.getXForDistance(dist, canvasWidth));
//        console.log(knobX);;
        //        knobX++;
        var time = worksheet.getValue(yParameter);

        knobY = canvasHeight - Tangle.views.v_wavePlot.getYForTime(time, canvasHeight);
        console.log('time', time);
        
        knobEl.setStyles( { left: knobX - knobWidth/2, top: knobY - knobHeight/2 } );
        lineEl.setStyles( { left: knobX });

    });

    // rollover effects

    var isShowing = false;
    var isHovering = false;

    canvasEl.addEvent("mouseenter", function () {
        isShowing = true; updateRolloverEffects();
    });
    canvasEl.addEvent("mouseleave", function () {
        isShowing = false; updateRolloverEffects();
    });
    knobEl.addEvent("mouseenter", function () {
        isHovering = true; updateRolloverEffects();
    });
    knobEl.addEvent("mouseleave", function () {
        isHovering = false; updateRolloverEffects();
    });

    function updateRolloverEffects () {
        updateCursor();
        var isShowingKnob = (isShowing || isHovering || isDragging);
        knobEl.setStyle("display", isShowingKnob ? "block" : "none");
    }

    function updateCursor() {
        var body = document.getElement("body");
        if (isHovering || isDragging) {body.addClass("cursorDrag"); }
        else { body.removeClass("cursorDrag"); }
    }

    var isDragging = false;
    var didDrag = false;
    var knobXAtMouseDown, knobYAtMouseDown;

    new BVTouchable(knobEl, {

        touchDidGoDown: function (touches) {

            knobXAtMouseDown = knobX;
            knobYAtMouseDown = knobY;
//            console.log('touched down at ', knobX, ',', knobY);
            isDragging = true;
            didDrag = true;
            knobEl.set("src", "http://worrydream.com/ExplorableExplanations/Media/FilterParamsKnobDrag.png");
            updateRolloverEffects();
        },

        touchDidMove: function (touches) {
            var obj = { };

//            console.log(worksheet.getValue(xParameter));
            
            var newX = knobXAtMouseDown + touches.translation.x;
            var dist = Tangle.views.v_wavePlot.getDistanceForX(newX, canvasWidth);// * xBounds.max;

            obj[xParameter] =  dist.limit(xBounds.min, xBounds.max);
            obj[yParameter] = Math.sqrt(dist);
//            console.log('setting ' + xParameter + ' to ' + obj[xParameter]);
            
            var newY = knobYAtMouseDown - touches.translation.y;
            var tt = getTTForY(newY);
//            obj[yParameter] = 10;//tt.limit(yBounds.min, yBounds.max);

            //console.log(newX + ' ' + newY);
//            console.log(obj);
//            console.log(worksheet);
            worksheet.setValues(obj);
        },

        touchDidGoUp: function(touches) {
            isDragging = false;
            knobEl.set("src", "http://worrydream.com/ExplorableExplanations/Media/FilterParamsKnob.png");

            updateRolloverEffects();
        }
    });
        
    
};

Tangle.controls.c_waveSimKnob = function(el, worksheet) {

    var tParam = "simTime";
    var tBounds = {min: 0, max: 100};


};


Tangle.controls.c_adjustableNumber = function(el, worksheet) {
    var bounds = getBounds();
    console.log(bounds);
    var container = worksheet.element;

    // cursor
    var isHovering = false;

    el.addEvent("mouseenter", function () { isHovering = true;   updateRolloverEffects(); });
    el.addEvent("mouseleave", function () { isHovering = false;  updateRolloverEffects(); });

    function updateRolloverEffects () {
        updateColor();
        updateCursor();
        updateHelp();
    }

    function isActive () {
        return isDragging || (isHovering && !isAnyAdjustableNumberDragging);
    }

    function updateColor () {
        if (isActive()) { el.addClass("c_adjustableNumberHover"); }
        else { el.removeClass("c_adjustableNumberHover"); }
    }

    function updateCursor () {
        var body = document.getElement("body");
        if (isActive()) { body.addClass("cursorDragHorizontal"); }
        else { body.removeClass("cursorDragHorizontal"); }
    }


    // help

    var help   = (new Element("div", { "class": "adjustableNumberHelp" })).inject(container, "top");
    help.setStyle("display", "none");
    help.set("text", "drag");

    function updateHelp () {
        var position = el.getPosition(container);
        var size = el.getSize();
        position.y -= size.y - 4;
        position.x += Math.round(0.5 * (size.x - 20));
        help.setPosition(position);
        help.setStyle("display", (isHovering && !isAnyAdjustableNumberDragging) ? "block" : "none");
    }

    // drag

    var isDragging = false;
    var valueAtMouseDown;

    new BVTouchable(el, {

        touchDidGoDown: function (touches) {
            valueAtMouseDown = worksheet.getValue(el);
            isDragging = true;
            isAnyAdjustableNumberDragging = true;
            updateRolloverEffects();
        },

        touchDidMove: function (touches) {
            var value = valueAtMouseDown + touches.translation.x / 5 * bounds.step;
            value = ((value / bounds.step).round() * bounds.step).limit(bounds.min, bounds.max);
            worksheet.setValue(el, value);
            updateHelp();
        },

        touchDidGoUp: function (touches) {
            help.setStyle("display", "none");
            isDragging = false;
            isAnyAdjustableNumberDragging = false;
            updateRolloverEffects();
        }
    });
    
    function getBounds () {
        var bounds = { min:1, max:10, step:1 };
        var prefix = "bounds_";

        el.className.split(" ").each( function(className) {
            if (className.indexOf(prefix) != 0) { return; }
            var parts = className.split("_");
            bounds.min = parts[1].replace("-",".").toFloat();
            bounds.max = parts[2].replace("-",".").toFloat();
            if (parts[3]) { bounds.step = parts[3].replace("-",".").toFloat(); }
        });

        return bounds;
    }
}
