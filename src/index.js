
import "core-js/stable";
import "regenerator-runtime/runtime";


const runCode = async () => {

  const currentImagesLoadingTracker = {}

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
      return { ok: true, collection: data.hits };
    } catch {
      return { ok: false, collection: [] };
    }
  }

  const nextBtn = document.getElementById('btn--next');
  const previousBtn = document.getElementById('btn--previous');

  const getImages = async () => {
    latestFetchTimestamp = Date.now();
    const currentTimestamp = latestFetchTimestamp;

    const fetchedImages = await fetchImages({ page: currentPage, perPage: imagesPerPage });
    if(!fetchedImages.ok) return;
    // If these values are different it means another request has occured while we were
    // awaiting this one, and that means its stale, so let's return early and do nothing
    if (currentTimestamp !== latestFetchTimestamp) return;
    images = fetchedImages.collection;

   



    images.forEach((image, i) => {
      const photo = document.querySelector(`[data-photo-num='${i + 1}']`);
      photo.setAttribute('data-img-id', image.id);

      const img = photo.querySelector(".photo__img");
      img.src = image.previewURL;
      img.onload = function (ev) {
        photo.classList.add('loaded')
      };
            photo.onclick = (ev) => {
        const modalImages = document.querySelectorAll('.modal__image');
        modalImages.forEach(image => {
          image.classList.add('d-none')
        })
        document.querySelector('.modal-overlay').classList.remove("d-none");
        const imgId = ev.currentTarget.dataset.imgId;
        const findSelectedImage = (_images) => {
          return _images.find(image => `${image.id}` === `${imgId}`)
        }
  
        // const selectedImage = findSelectedImage(images);
        modalImages.forEach(image => {
          const isSelectedImg = image.dataset.imgId === imgId;
  
          if (isSelectedImg) {
            image.classList.remove('d-none')
          }
  
        })
        // img.src = image.largeImageURL;
      // img.setAttribute('data-img-id', image.id);

      // modalImageBg.append(img)
  
        // img.classList.remove('d-none');
        
      }

      

      const createModalImage = () => {
        const modalImageBg = document.getElementById('modal__image__bg')
      const modalImg = document.createElement('img');

      modalImg.classList.add('modal__image');
      modalImg.classList.add('d-none');
      modalImg.src = image.largeImageURL;
      modalImg.setAttribute('data-img-id', image.id);
      modalImageBg.append(modalImg)
      



      }

      createModalImage();
      

      
    })


    if (images.length < 10) {
      for (let i = images.length; i < 10; i++) {
        const photo = document.querySelector(`[data-photo-num='${i + 1}']`);
        photo.classList.add('d-none')

      }
    }



    return images;

  }







  const resetImagesToLoadingState = () => {
    removeElements(document.querySelectorAll(".modal__image"));
    const allImageContainers = document.querySelectorAll(".photo");

    allImageContainers.forEach(imageContainer => {
      imageContainer.classList.remove('loaded');
      imageContainer.classList.remove('d-none');
    })

    const allImages = document.querySelectorAll(".photo__img");

    allImages.forEach(image => {
      image.onload = () => { };
    })

  }

  const setButtonEnabledStatusAfterPageChange = (btnElement, bool) => {
    if (!btnElement) return;
    btnElement.disabled = !bool;
  }

  const upDatePaginationBtnsEnabledState = () => {
    setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= 10)
    setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1)

  }



  nextBtn.addEventListener('click', async () => {
    currentPage += 1;
    upDatePaginationBtnsEnabledState()
    resetImagesToLoadingState();
    await getImages()
    upDatePaginationBtnsEnabledState()
  })

  previousBtn.addEventListener('click', async () => {
    if (currentPage > 1) {
      currentPage -= 1
    } else {
      currentPage = 1;
    }
    upDatePaginationBtnsEnabledState()
    resetImagesToLoadingState();
    await getImages()
    upDatePaginationBtnsEnabledState()
  })

  await getImages();
  upDatePaginationBtnsEnabledState()

  document.querySelector('.modal-overlay').addEventListener('click', (ev) => {
    if (document.getElementById('modal__image__bg').contains(ev.target)) return;
    document.querySelector('.modal-overlay').classList.add("d-none");
  })

  document.querySelector('.btn-close-modal').addEventListener('click', (ev) => {
    document.querySelector('.modal-overlay').classList.add("d-none");
  })

}

runCode();















const ignoreTemp = () => {

 

  const addThumbnail = (image, photoElem) => {

    if (!image) return;

    // const photoElem = document.createElement('div');
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

        if (isSelectedImg) {
          image.classList.remove('d-none')
        }

      })

      img.classList.remove('d-none');
    }

    photoElem.setAttribute('data-img-id', image.id);
    const img = document.createElement('img');
    img.onload = function (ev) {
      // always called
      console.log('ev', ev.path[1].dataset.imgId)
      photoElem.classList.add('loaded')
      img.classList.remove("d-none");




      // alert('image loaded');
    };
    img.src = image.previewURL;
    img.className = "photo__img";
    img.classList.add("d-none");
    createAndAppendSkeletonThumbnail(photoElem, true)

    photoElem.append(img);

    const imagesContainer = document.getElementById('images--container')
    imagesContainer.append(photoElem)
  }

  const setButtonEnabledStatusAfterPageChange = (btnElement, bool) => {
    if (!btnElement) return;
    btnElement.disabled = !bool;
  }

  const createAndAppendSkeletonThumbnail = (elemToAppendTo, isPosAbsolute) => {
    const skeletonThumbnailContainerElem = document.createElement('div');
    skeletonThumbnailContainerElem.className = "skeleton-thumbnail-container";
    const skeletonThumbnailElem = document.createElement('div');
    skeletonThumbnailElem.className = "skeleton-thumbnail";
    skeletonThumbnailContainerElem.append(skeletonThumbnailElem)
    elemToAppendTo.append(skeletonThumbnailContainerElem)

    if (isPosAbsolute) {
      skeletonThumbnailContainerElem.classList.add("skeleton-thumbnail-container-p-absolute")
    }
  }


  const showSkeletonImages = () => {

    const imagesContainer = document.getElementById('images--container')
    for (let i = 0; i < 10; i++) {
      const photoElem = document.createElement('div');
      photoElem.className = "photo";
      photoElem.classList.add("photo-for-skeleton");

      createAndAppendSkeletonThumbnail(photoElem, false)

      imagesContainer.append(photoElem)
    }

  }
  const fetchImagesAndRenderToDom = async (pageNum) => {
    latestFetchTimestamp = Date.now();
    const currentTimestamp = latestFetchTimestamp;
    // showSkeletonImages()
    // return;
    const fetchedImages = await fetchImages({ page: pageNum, perPage: imagesPerPage });
    if (!fetchedImages.ok) return;

    // If these values are different it means another request has occured while we were
    // awaiting this one, and that means its stale, so let's return early and do nothing
    if (currentTimestamp !== latestFetchTimestamp) return;
    removeElements(document.querySelectorAll(".photo-for-skeleton"));

    const allPhotoElems = document.querySelectorAll(".photo");

    const hasRenderPhotoElems = allPhotoElems.length;
    console.log('allPhotoElems', allPhotoElems)

    images = fetchedImages.collection;
    const nextBtn = document.getElementById('btn--next');
    // If the number of images is less than imagesPerPage we are making the assumption we are on the last page
    setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= imagesPerPage)
    removeElements(document.querySelectorAll(".modal__image"));
    images.slice(0, 10).forEach((image, i) => {

      const _photoElem = allPhotoElems[i] || document.createElement('div');
      console.log('allPhotoElems[i]', allPhotoElems[i])
      addThumbnail(image, _photoElem)

      const modalImageBg = document.getElementById('modal__image__bg')
      const img = document.createElement('img');
      // const img = new Image();

      img.classList.add('modal__image');
      img.classList.add('d-none');
      // img.onload(ev => {
      //   console.log('ev', ev)
      // })
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
    // removeElements(document.querySelectorAll(".photo"));


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
    // removeElements(document.querySelectorAll(".photo"));
    fetchImagesAndRenderToDom(currentPage);
  })

  setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1)

}