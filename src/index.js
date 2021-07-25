
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./styles.css";

const addQueryParams = (paramsObj = {}) => {
  const keys = Object.keys(paramsObj);
  return keys.map(key => `${key}=${paramsObj[key]}`).join('&')
}

const removeElements = (elms) => elms.forEach(el => el.remove());

let currentPage = 1;
const imagesPerPage = 10;

const fetchImages = async ({ page = 1, perPage }) => {
  const queryParamsObj = {
    key: '22638056-d088870190bfd9698c73834e3',
    q: 'Movies',
    orientation: "vertical",
    'per_page': perPage,
    page,
  };

  const queryParams = addQueryParams(queryParamsObj);
  const baseUrl = 'https://pixabay.com/api';
  const fullUrl = `${baseUrl}?${queryParams}`;
  const res = await fetch(fullUrl);
  const data = await res.json()
  return data.hits;
}

const addThumbnail = (imgSrc) => {
  const figure = document.createElement('div');
  figure.className = "photo";
  const img = document.createElement('img');
  img.src = imgSrc;
  img.className = "photo__img";
  figure.append(img)

  const imagesContainer = document.getElementById('images--container')
  imagesContainer.append(figure)
}

const setButtonEnabledStatusAfterPageChange = (btnElement, bool) => {
  if (!btnElement) return;
  btnElement.disabled = !bool;
}

const fetchImagesAndRenderToDom = async (pageNum) => {
  const images = await fetchImages({ page: pageNum, perPage: imagesPerPage });
  const nextBtn = document.getElementById('btn--next');
  // If the number of images is less than imagesPerPage we are making the assumption we are on the last page
  setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= imagesPerPage)
  images.slice(0, 10).forEach(image => {
    addThumbnail(image.previewURL)
  })
}

fetchImagesAndRenderToDom(currentPage)
const nextBtn = document.getElementById('btn--next');

nextBtn.addEventListener('click', () => {
  currentPage += 1
  const previousBtn = document.getElementById('btn--previous');
  setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1)
  removeElements(document.querySelectorAll(".photo"));
  fetchImagesAndRenderToDom(currentPage)
})

const previousBtn = document.getElementById('btn--previous');
previousBtn.addEventListener('click', () => {

  if (currentPage > 1) {
    currentPage -= 1
  } else {
    currentPage = 1;
  }

  setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1);
  removeElements(document.querySelectorAll(".photo"));
  fetchImagesAndRenderToDom(currentPage);
})

setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1)

