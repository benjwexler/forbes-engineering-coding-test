
import { fireEvent, getByText, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import "core-js/stable";
import "regenerator-runtime/runtime";
import { fetchImages } from "./index.js";

const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf8');

let dom
let container

const mockResImagesCollection = [
  {
    "id": 4557864,
    "pageURL": "https://pixabay.com/photos/joker-clown-halloween-horror-evil-4557864/",
    "type": "photo",
    "tags": "joker, clown, halloween",
    "previewURL": "https://cdn.pixabay.com/photo/2019/10/17/21/17/joker-4557864_150.jpg",
    "previewWidth": 100,
    "previewHeight": 150,
    "webformatURL": "https://pixabay.com/get/g96cde54ff33a7b12cca702b77f139bdf561bfc2480e571440bd8d460ebe10575b092fa44eae8e0764091e3004831ff1fe4b68924b525336f40b0c971e4b43bcf_640.jpg",
    "webformatWidth": 426,
    "webformatHeight": 640,
    "largeImageURL": "https://pixabay.com/get/g713e6d42d681098b91b608ddc14c007c0a1f89a50ebfcd1034756483a91cdfd67bc60b082784651e60e33a858327569749ea8f48e03406f59f35a5e6f1a21fcc_1280.jpg",
    "imageWidth": 3648,
    "imageHeight": 5472,
    "imageSize": 3852302,
    "views": 37913,
    "downloads": 29241,
    "collections": 41,
    "likes": 58,
    "comments": 19,
    "user_id": 10634669,
    "user": "Sammy-Williams",
    "userImageURL": "https://cdn.pixabay.com/user/2020/11/30/18-58-21-434_250x250.jpg"
  },
  {
    "id": 5354477,
    "pageURL": "https://pixabay.com/photos/city-cinema-vintage-valencia-5354477/",
    "type": "photo",
    "tags": "city, cinema, vintage",
    "previewURL": "https://cdn.pixabay.com/photo/2020/06/29/21/13/city-5354477_150.jpg",
    "previewWidth": 100,
    "previewHeight": 150,
    "webformatURL": "https://pixabay.com/get/gcbf3b8c0817cbc6ad3b9d3ee8a141b37201df3188d46b754eed215fddb4fd3ebe6d864eedb4f61be9f461fc941ca598e292f2c10ed4220a34ded0114c775d093_640.jpg",
    "webformatWidth": 427,
    "webformatHeight": 640,
    "largeImageURL": "https://pixabay.com/get/gcd25db8a9d949382214699b8253eddf7e6ebc4f669ed6c8ca586261855f81f4a1f59dc39dec05d66a847b15dacd337cc6b66ac76fe4efc49f224f8171c9e7847_1280.jpg",
    "imageWidth": 3297,
    "imageHeight": 4946,
    "imageSize": 4626920,
    "views": 14770,
    "downloads": 12805,
    "collections": 25,
    "likes": 25,
    "comments": 5,
    "user_id": 17265152,
    "user": "AveCalvar",
    "userImageURL": "https://cdn.pixabay.com/user/2020/06/29/21-10-30-636_250x250.jpg"
  },
];

describe('Testing fetchImage', () => {
  it('Fetch Image API handles successful request with data returned', async () => {
    global.fetch = (() =>
      Promise.resolve({
        json: () => Promise.resolve({ hits: mockResImagesCollection }),
      })
    );

    const imagesRes = await fetchImages({ page: 1 });
    expect(imagesRes.ok).toBe(true);
    expect(imagesRes.collection.length).toEqual(mockResImagesCollection.length)
  })

  it('Fetch Image API handles bad request', async () => {
    
    global.fetch = (() =>
      Promise.resolve({
        json: () => Promise.reject(),
      })
    );

    const imagesRes = await fetchImages({ page: 1 });
    expect(imagesRes.ok).toBe(false);
  })
})

describe('Testing index.html', () => {
  beforeEach(async () => {
    dom = new JSDOM(html)
    container = dom.window.document.body
  })
})