
import _ from 'lodash';
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./styles.css";

 function component() {

   const fetchImages = async () => {
     const queryParamsObj = {
       key: '22638056-d088870190bfd9698c73834e3',
       q: 'code',
       orientation: "vertical",
       'per_page': 200,
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

    document.body.append(imagesContainer)
    
    imagesContainer.append(figure)

   }

  //  addThumbnail()

   const fetchImagesAndRenderToDom = async () => {
    const images = await fetchImages();

    images.forEach(image => {
      console.log('image', image)
      addThumbnail(image.previewURL)
    })


   }

   fetchImagesAndRenderToDom()




 }

 document.body.appendChild(component());
