
// deprecated, moved to earthquake.js
function initSlider (tangle) {
    
    var container = $("sliderDiv");

    var script = {
        initialize: function(model) {
            console.log('initializing slider');
            // initial slider position
            model.pos = 0;
        },

        update: function(model) {

            // wtf
            model['pos']++;
        }
    };
    
    var worksheet = tangle.addWorksheet("slider", container, script);
}
