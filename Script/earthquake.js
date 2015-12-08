

function initEarthquakeExample (tangle) {

    var container = $("earthquakeExample");
//    console.log('1 - initializing earthquakeExample');

    var script = {
        initialize: function(model) {
            
            // for calcaulating epicenter
            model.tp = 12;
            model.ts = 14;
            model.td = model.ts - model.tp;
            
            model.ed0 = 0;
            model.tt0 = 0;
            model.dmx = 0;
            
//            console.log('3 - init earthquake model');
//            console.log(model);
            
        },

        update: function(model) {
//            console.log('4 - update earthquake model');
            console.log('updating');
            // first update adjustable numbers
            
            model.td = model.ts - model.tp;
//            console.log(model);
//            console.log('model.edo: ' + model.edo); 
//            model.dmx++;
//            model.ed0++;
            
            model['pwSim'] = Date.now() / 1000;
            model['swSim'] = 'hello';
            
            model['kf2'] = 'hello';
            
//            console.log('5 - done updating earthquake model');
            
        }
    };

    var worksheet = tangle.addWorksheet("earthquake", container, script);
    //worksheet.setValue("index", 3);
}
