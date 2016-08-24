

## Explorable Earthquakes

Based on the example [here](http://worrydream.com/ExplorableExplanations)

I had a lot of fun building this for the Watson Cognitive Tutor, a project done by The IBM Watson Education team who worked with a classroom to help prepare 9th graders for their New York Regents exams. I used the [Tangle.js](http://worrydream.com/Tangle/) library to build the reactive sliders, and I used Javascript canvas to illustrate the traveling waves and the Cartesian plot. I also used a creative ananlogy to describe the life of an anthropomorphic earthquake sensor, which may help more students with a more kinesthetic learning style.

This was my first time making an interactive, reactive educational interface, so there are a few improvements I know I could make
- better description at the beginning (although this was used in conjunction with a lesson plan, so the kids would have some background).


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


