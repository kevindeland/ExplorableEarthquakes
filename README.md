## Explorable Earthquakes

Playing with the example listed [here](http://worrydream.com/ExplorableExplanations)

### Running locally
```bash
http-server -p 8333
```
use browser to visit [localhost:8333](http://localhost:8333)

### Important Files

[main.js](./Scripts/main.js)
-- calls initialization functions for various worksheets (which are defined in filter.js, park.js, etc)

[earthquake.js](./Scripts/earthquake.js)
-- initialization function for filter, which includes *initialize* and *update* behavior
-- set 'model' values
-- adds a worksheet to Tangle, with various values

[controls.js](./Scripts/controls.js)
-- defines behavior for various button presses and interactive elements

[views.js](./Scripts/views.js)
-- defines behavior for html elements


