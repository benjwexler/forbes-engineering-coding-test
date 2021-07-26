# forbes-engineering-coding-test

## Running the application

* Make sure all `node_modules` are installed by running `npm i`
* run `npm start` and open `localhost:9000`

## Build

* This app makes uses of webpack and babel and has hot reloading enabled.
* I decided to not have webpack build the css and instead included a script tag for the css directly because I was noticing a slight lag with the css being applied when it was being built with webpack.

## Tech Decisions

* I decided a fun challenge for me for this project was going to be to include a skeleton loader for each image in the thumbnail before the data for the images has been fetched and before the image has fully loaded for the thumbnail.
  * To see this in action, I recomend going into the `Performance` tab for Chrome Dev Tools and adding some throttling.
  * To accomplish this, each thumbnail has a skeleton loader that is absolutely positioned to the respective thumbnail container
  * The skeleton is hidden when the thumbnail container has a class of `loaded`, which is added when the thumbnail img's `onload` event has completed.
* When the user click on a new page all thumbnails are removed and re-added to the DOM right away.
  * This was done because when I tested the app with throttling enabled if some images had loaded while others hadn't and then the user switched pages, the skeketon loaders would get out of sync. 
