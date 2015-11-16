//
//  c_filterParams.js


Tangle.controls.c_filterKnob = function(el, worksheet) {
    console.log('2 - in wave knob');
    
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

    var lineStyle = "position:absolute; display:block; border-left:1px dotted #00f; pointer-events:none; width:1px; h\
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
    knobY = 10;
    // TODO why is this not being called?
    worksheet.setView(el, function () {
        console.log('7 - setting view');
        // set knob X and Y values
        //knobX = 10;
        knobX++;
        knobY++; //knobY = 10;
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
    knobEl.addEvent("mouseenter", function () {
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
            console.log('touched down at ', knobX, ',', knobY);
            isDragging = true;
            didDrag = true;
            knobEl.set("src", "http://worrydream.com/ExplorableExplanations/Media/FilterParamsKnobDrag.png");
            updateRolloverEffects();
        },

        touchDidMove: function (touches) {
            var obj = { };

//            console.log(worksheet.getValue(xParameter));
            
            var newX = knobXAtMouseDown + touches.translation.x;
            var dist = Tangle.views.v_freqPlot.getDistanceForX(newX, canvasWidth) * xBounds.max;

            
            obj[xParameter] =  10;//dist.limit(xBounds.min, xBounds.max);


            var newY = knobYAtMouseDown - touches.translation.y;
            var tt = getTTForY(newY);
            obj[yParameter] = 10;//tt.limit(yBounds.min, yBounds.max);

            //console.log(newX + ' ' + newY);
            console.log(obj);
            console.log(worksheet);
            worksheet.setValues(obj);
        },

        touchDidGoUp: function(touches) {
            isDragging = false;
            knobEl.set("src", "http://worrydream.com/ExplorableExplanations/Media/FilterParamsKnob.png");

            updateRolloverEffects();
        }
    });
        
    
};