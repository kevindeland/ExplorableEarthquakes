

function initEarthquakeExample (tangle) {

    var container = $("earthquakeExample");
//    console.log('1 - initializing earthquakeExample');

    var script = {
        initialize: function(model) {

            model.tp = 12;
            model.ts = 14;
            model.td = model.ts - model.tp;
            
            model.ed0 = 4;
            model.tt0 = 4;
            model.dmx = 0;
            
//            console.log('3 - init earthquake model');
//            console.log(model);
            
        },

        update: function(model) {
//            console.log('4 - update earthquake model');

            // first update adjustable numbers
            model.td = model.ts - model.tp;
//            console.log(model);
//            console.log('model.edo: ' + model.edo); 
//            model.dmx++;
//            model.ed0++;

            model['kf2'] = 'hello';

            
//            console.log('5 - done updating earthquake model');
            
        }
    };

    var worksheet = tangle.addWorksheet("earthquake", container, script);
    //worksheet.setValue("index", 3);
}
