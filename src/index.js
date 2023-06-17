import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { loadImages } from './js/api';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const observerEl = document.querySelector('.observer');
const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
const perPage = 40;
let query = '';

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  const { searchQuery } = evt.currentTarget.elements;
  query = searchQuery.value.trim();
  loadImages(currentPage, perPage, query)
    .then(resp => {
      if (Number(resp.data.totalHits) === 0) {
        return Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      galleryEl.insertAdjacentHTML('beforeend', createMarkup(resp.data.hits));
      Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images`);
      observer.observe(observerEl);
      lightbox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(err => Notiflix.Notify.failure(err.message));
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
        </div>`
    )
    .join('');
}
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);
function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      loadImages(currentPage, perPage, query)
        .then(resp => {
          galleryEl.insertAdjacentHTML(
            'beforeend',
            createMarkup(resp.data.hits)
          );
          lightbox.refresh();
          if (currentPage === Math.ceil(resp.data.totalHits / perPage)) {
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
            observer.unobserve(observerEl);
          }
          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        })
        .catch(err => Notiflix.Notify.failure(err.message));
    }
  });
}
