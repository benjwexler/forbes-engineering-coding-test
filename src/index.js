
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
let images = [];

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

  try {
    const res = await fetch(fullUrl);
    const data = await res.json()
    return data.hits;
  } catch {
    return [];
  }
}

document.querySelector('.modal-overlay').addEventListener('click', (ev) => {
  if (document.getElementById('modal__image__bg').contains(ev.target)) return;
  document.querySelector('.modal-overlay').classList.add("d-none");
})

document.querySelector('.btn-close-modal').addEventListener('click', (ev) => {
  document.querySelector('.modal-overlay').classList.add("d-none");
})



const addThumbnail = (image) => {

  if (!image) return;

  const photoElem = document.createElement('div');
  photoElem.className = "photo";

  photoElem.onclick = (ev) => {
    document.querySelector('.modal-overlay').classList.remove("d-none");
    console.log('images', images)
    const imgId = ev.currentTarget.dataset.imgId;
    const findSelectedImage = (_images) => {
      return _images.find(image => image.id === parseInt(imgId))
    }

    const selectedImage = findSelectedImage(images);

    console.log('target', ev.currentTarget.dataset.imgId)
    if (!images[0]) return;
    console.log('image[0].largeImageURL', images[0].largeImageURL)
    document.getElementById('modal__image').src = selectedImage.largeImageURL
  }

  photoElem.setAttribute('data-img-id', image.id);
  const img = document.createElement('img');
  img.src = image.previewURL;
  img.className = "photo__img";
  photoElem.append(img);

  const imagesContainer = document.getElementById('images--container')
  imagesContainer.append(photoElem)
}

const setButtonEnabledStatusAfterPageChange = (btnElement, bool) => {
  if (!btnElement) return;
  btnElement.disabled = !bool;
}

const fetchImagesAndRenderToDom = async (pageNum) => {
  images = await fetchImages({ page: pageNum, perPage: imagesPerPage });
  console.log('images', images)
  const nextBtn = document.getElementById('btn--next');
  // If the number of images is less than imagesPerPage we are making the assumption we are on the last page
  setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= imagesPerPage)
  images.slice(0, 10).forEach(image => {
    addThumbnail(image)
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

