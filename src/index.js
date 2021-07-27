
import "core-js/stable";
import "regenerator-runtime/runtime";

const removeElements = (elms) => elms.forEach(el => el.remove());
const addQueryParams = (paramsObj = {}) => {
  const keys = Object.keys(paramsObj);
  return keys.map(key => `${key}=${paramsObj[key]}`).join('&');
}

const imagesPerPage = 10;

export const fetchImages = async ({ page }) => {
  const queryParamsObj = {
    key: '22651127-6c7d16fdb5ebe111783afec3c',
    q: 'Movies',
    orientation: "vertical",
    'per_page': imagesPerPage,
    page,
  };

  const queryParams = addQueryParams(queryParamsObj);
  const baseUrl = 'https://pixabay.com/api';
  const fullUrl = `${baseUrl}?${queryParams}`;

  try {
    const res = await fetch(fullUrl);
    const data = await res.json()
    return { ok: true, collection: data.hits };
  } catch {
    return { ok: false, collection: [] };
  }
}

const addThumbnailsInLoadingState = (thumbnailsPerPage) => {

  const createThumbnail = (num) => {
    const photo = document.createElement('div');
    photo.className = "photo";
    photo.setAttribute('data-photo-num', num);

    const skeletonThumbnailContainer = document.createElement('div');
    skeletonThumbnailContainer.className = "skeleton-thumbnail-container";

    const skeletonThumbnail = document.createElement('div');
    skeletonThumbnail.className = "skeleton-thumbnail";

    skeletonThumbnail.style.animationDelay = `${num * 100}ms`;

    photo.style.animationDelay = `${num * 50}ms`
    skeletonThumbnailContainer.append(skeletonThumbnail);

    const photoImg = document.createElement('img');
    photoImg.className = "photo-img";

    photo.append(skeletonThumbnailContainer)
    photo.append(photoImg)

    document.getElementById('images-container').append(photo);

  }

  for (let i = 1; i <= thumbnailsPerPage; i++) {
    createThumbnail(i)
  }
}
const runCode = async () => {
  let currentPage = 1;
  let images = [];
  let latestFetchTimestamp = Date.now();

  const nextBtn = document.getElementById('btn--next');
  const previousBtn = document.getElementById('btn--previous');

  const fetchImagesAndRenderToDom = async () => {
    try {
      latestFetchTimestamp = Date.now();
      const currentTimestamp = latestFetchTimestamp;
      const fetchedImages = await fetchImages({ page: currentPage });
      if (!fetchedImages.ok) return { ok: false };

      // If these values are different it means another request has occured while we were
      // awaiting this one, and that means its stale, so let's return early and do nothing
      if (currentTimestamp !== latestFetchTimestamp) return { ok: false, isStale: true };

      images = fetchedImages.collection;

      const createHiddenModalImage = (_image) => {
        const modalImageBg = document.getElementById('modal-image-bg');
        const modalImg = document.createElement('img');
        modalImg.classList.add('modal-image');
        modalImg.classList.add('d-none');
        modalImg.src = _image.largeImageURL;
        modalImg.setAttribute('data-img-id', _image.id);
        modalImageBg.append(modalImg);
      };

      images.forEach((image, i) => {
        const photo = document.querySelector(`[data-photo-num='${i + 1}']`);
        photo.setAttribute('data-img-id', image.id);
        const img = photo.querySelector(".photo-img");
        img.src = image.previewURL;
        img.onload = function (ev) {
          photo.classList.add('loaded');
        };
        photo.onclick = (ev) => {
          const modalImages = document.querySelectorAll('.modal-image');
          modalImages.forEach(image => {
            image.classList.add('d-none');
          })
          // img hasn't loaded so don't show the modal
          if (!ev.currentTarget.classList.contains('loaded')) return;
          document.querySelector('.modal-overlay').classList.remove("d-none");
          const imgId = ev.currentTarget.dataset.imgId;

          modalImages.forEach(image => {
            const isSelectedImg = image.dataset.imgId === imgId;

            if (isSelectedImg) {
              image.classList.remove('d-none');
            }
          })
        }

        // For every thumbnail we are going to create a matching img element inside in the modal
        // Each modal img will be hidden untill it is selected
        // We are creating the images at the same time the thumbnail is rendered, so the modal img
        // doesn't have to load when the modal is open and can be loaded behind the scenes
        createHiddenModalImage(image);
      })

      // If there are less images than the max amount per page, we have to make sure no images
      // are perpetually displaying in the loading state, so we hide these elements
      if (images.length < imagesPerPage) {
        for (let i = images.length; i < imagesPerPage; i++) {
          const photo = document.querySelector(`[data-photo-num='${i + 1}']`);
          photo.classList.add('fade-out');
        }
      }

      return { ok: true }
    } catch (err) {
      return { ok: false };
    }
  }

  const setButtonEnabledStatusAfterPageChange = (btnElement, bool) => {
    if (!btnElement) return;
    btnElement.disabled = !bool;
  }

  const upDatePaginationBtnsEnabledState = () => {
    setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= imagesPerPage)
    setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1)
  }

  const resetImagesToLoadingState = () => {
    removeElements(document.querySelectorAll('.photo'))
    removeElements(document.querySelectorAll(".modal-image"));
  }

  const updateStateFetchAndRenderImages = async () => {
    upDatePaginationBtnsEnabledState();

    resetImagesToLoadingState();
    addThumbnailsInLoadingState(imagesPerPage);

    const fetchAndRender = await fetchImagesAndRenderToDom();

    if(fetchAndRender.isStale) return;

    if (!fetchAndRender.ok) { 
      alert('Uh oh, there was an error. Please refresh the page.')
    }
    upDatePaginationBtnsEnabledState();
  }

  nextBtn.addEventListener('click', async () => {
    currentPage += 1;
    updateStateFetchAndRenderImages();
  })

  previousBtn.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage -= 1
    } else {
      currentPage = 1;
    }
    updateStateFetchAndRenderImages();
  })

  const modalOverlayElem = document.querySelector('.modal-overlay');

  modalOverlayElem.addEventListener('click', (ev) => {
    if (document.getElementById('modal-image-bg').contains(ev.target)) return;
    modalOverlayElem.classList.add("d-none");
  })

  document.querySelector('.btn-close-modal').addEventListener('click', (ev) => {
    modalOverlayElem.classList.add("d-none");
  })

  updateStateFetchAndRenderImages();
}

document.addEventListener('DOMContentLoaded', function () {
  runCode();
})


