
import "core-js/stable";
import "regenerator-runtime/runtime";

const addQueryParams = (paramsObj = {}) => {
  const keys = Object.keys(paramsObj);
  return keys.map(key => `${key}=${paramsObj[key]}`).join('&')
}

const removeElements = (elms) => elms.forEach(el => el.remove());

let currentPage = 1;
const imagesPerPage = 10;
let images = [];
let latestFetchTimestamp = Date.now();

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
    const modalImages = document.querySelectorAll('.modal__image');
    modalImages.forEach(image => {
        image.classList.add('d-none')
    })
    document.querySelector('.modal-overlay').classList.remove("d-none");
    const imgId = ev.currentTarget.dataset.imgId;
    const findSelectedImage = (_images) => {
      return _images.find(image => `${image.id}` === `${imgId}`)
    }

    const selectedImage = findSelectedImage(images);
    modalImages.forEach(image => {
      const isSelectedImg = image.dataset.imgId === imgId;

      if(isSelectedImg) {
        image.classList.remove('d-none')
      } 
  
    })

    img.classList.remove('d-none');
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
  latestFetchTimestamp = Date.now();
  const currentTimestamp = latestFetchTimestamp;
  const fetchedImages = await fetchImages({ page: pageNum, perPage: imagesPerPage });

  // If these values are different it means another request has occured while we were
  // awaiting this one, and that means its stale, so let's return early and do nothing
  if (currentTimestamp !== latestFetchTimestamp) return;

  images = fetchedImages;
  const nextBtn = document.getElementById('btn--next');
  // If the number of images is less than imagesPerPage we are making the assumption we are on the last page
  setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= imagesPerPage)
  images.slice(0, 10).forEach(image => {
    addThumbnail(image)

    const modalImageBg =  document.getElementById('modal__image__bg')
    const img = document.createElement('img');
    img.classList.add('modal__image');
    img.classList.add('d-none');
    img.src = image.largeImageURL;
    img.setAttribute('data-img-id', image.id);
    modalImageBg.append(img)
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

