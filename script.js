// require('dotenv').config();

const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

// TODO: move all the flags to an object
let ready = false;
let isInitialLoad = true;
let imagesLoaded = 0;
let totalImages = 0;
let initialCount = 5;
let higherCount = 30;
let photosArray = [];


// TODO: Move the api key to an env file
const apiKey = "IzVcXa2bvx2q1K00gb--hXaBLiiylPTwXEJubbCsQZg";
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialCount}`;

// ===========================
// Main Function

async function init() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();

    // TODO: i'm bothered by the phrasing of the following if statement
    if (isInitialLoad) {
        increaseCount();
    }
  } catch (error) {
      throw new Error(error);
  }
}

// ===========================
// Helper Functions

function getMorePhotosWhenScrolling() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    imagesLoaded = 0;
    init();
  }
}

window.addEventListener("scroll", getMorePhotosWhenScrolling);

function increaseCount() {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${higherCount}`;
    isInitialLoad = false;
}

function displayPhotos() {
  totalImages = photosArray.length;
  photosArray.forEach(createImageElements);
}

// TODO: break this funciton up
function createImageElements(photo) {
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    img.addEventListener("load", changeReadyFlagAndHideLoader);
    item.appendChild(img);
    imageContainer.appendChild(item);
}

function setAttributes(element, attrs) {
  for (let key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
}

function changeReadyFlagAndHideLoader() {
  if (++imagesLoaded === totalImages) {
    ready = true;
    hideLoader();
  }
}

function hideLoader() { loader.hidden = true; }

// -------------------------------------------------

init();