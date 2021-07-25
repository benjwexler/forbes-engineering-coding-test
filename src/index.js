
import _ from 'lodash';
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./styles.css";


  let images = [];
  let currentPage = 1;
  const imagesPerPage = 10;

  const fetchImages = async ({ page = 1, perPage }) => {
    const queryParamsObj = {
      key: '22638056-d088870190bfd9698c73834e3',
      q: 'tennis',
      orientation: "vertical",
      'per_page': perPage,
      page,
    }

    const addQueryParams = (paramsObj) => {
      const keys = Object.keys(paramsObj);
      return keys.map(key => `${key}=${paramsObj[key]}`).join('&')
    }

    const queryParams = addQueryParams(queryParamsObj);
    const baseUrl = 'https://pixabay.com/api';
    const fullUrl = `${baseUrl}?${queryParams}`;

    const res = await fetch(fullUrl);
    const data = await res.json()
    // console.log('res', await res.json())
    return data.hits;
  }

  //  fetchImages();

  const addThumbnail = (imgSrc) => {
    const figure = document.createElement('div');
    figure.className = "photo";
    const img = document.createElement('img');
    img.src = imgSrc || "https://pixabay.com/get/g88373804ade03b6108b52ea363e767b52728304ec58725abc3523d6ad35b1ac954c00ac891bc2a021663b36a6cb375f783523c324d7876f5ea30dd275c8de42e_1280.jpg"
    img.className = "photo__img";
    figure.append(img)

    const imagesContainer = document.getElementById('images--container')

    // document.body.append(imagesContainer)

    imagesContainer.append(figure)

  }

  //  addThumbnail()

  const setButtonEnabledStatusAfterPageChange = (btnElement, bool) => {
    console.log('btn', btnElement)
    if (!btnElement) return;

    btnElement.disabled = !bool;

  }

  const fetchImagesAndRenderToDom = async (pageNum) => {
    const images = await fetchImages({ page: pageNum, perPage: imagesPerPage });

    console.log('image.length', images.length)
    const nextBtn = document.getElementById('btn--next');
    // If the number of images is less than imagesPerPage we are making the assumption we are on the last page
    setButtonEnabledStatusAfterPageChange(nextBtn, images.length >= imagesPerPage)

    images.slice(0, 10).forEach(image => {
      // console.log('image', image)
      addThumbnail(image.previewURL)
    })


  }

  const removeElements = (elms) => elms.forEach(el => el.remove());





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

    console.log('currentPage', currentPage)

    setButtonEnabledStatusAfterPageChange(previousBtn, currentPage > 1)

    removeElements(document.querySelectorAll(".photo"));

    fetchImagesAndRenderToDom(currentPage)

  })

// document.body.appendChild(component());
