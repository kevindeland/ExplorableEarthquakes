//
//  main.js

(function () {

    window.addEvent('domready', function() {
        var tangle = new Tangle();
        if (window.initEarthquakeExample) { initEarthquakeExample(tangle); }
    });

})();
