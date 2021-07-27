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
* Whenever new images are fetched, each image is loaded into the modal and hidden until the user click on that images respective thumbnail.
 * This was done because I noticed that when I waited to set the modal img's `src` until the user clicked on the thumbnail, the image could take a second to load after the modal had opened.
 * This approach has a positive and negative tradeoff (and I'm not certain I made the right decision):
   * With a fast connection, the modal image now appears right away
   * With a slow connection, I noticed that the modal can take awhile to load after the user has opened the modal.
    * Presumably, this is because I've asked the browser to load multiple images in the background, instead of focusing specifically on the image that the user has clicked on.
    * One solution to this problem would be to add skeleton loaders to the modal images.

## Testing

* I only implemented four tests for the app. Two are for a function I created to fetch the images, and the other two are for testing the initial HTML rendered to the DOM
* run `npm run test` to execute the tests.

# Future Improvements

* I didn't do much in the way of error handling for the UI, except for displaying an alert to the user letting them know to refresh the page
* I didn't add any UI notice for the situation when the request was sucessful, but there are no images to display.
  * Right now, the user will just encounter a blank photo section after the loaders have disappeared.
