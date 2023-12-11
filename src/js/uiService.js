// uiService.js
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, perPage } from './apiService.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('loadMore');
let currentPage = 1;
let searchQuery = '';
let totalHits = 0;

function createCardMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `
        <div class="photo-card">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b> ${likes}</p>
                <p class="info-item"><b>Views</b> ${views}</p>
                <p class="info-item"><b>Comments</b> ${comments}</p>
                <p class="info-item"><b>Downloads</b> ${downloads}</p>
            </div>
        </div>`;
}

function updateGalleryMarkup(images) {
    const markup = images.map(createCardMarkup).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.gallery a').refresh();
}

function clearGallery() {
    gallery.innerHTML = '';
}

function handleLoadMoreVisibility() {
    if (currentPage * perPage >= totalHits) {
        loadMoreBtn.classList.add('isHidden');
        if (totalHits > 0) {
            Notiflix.Notify.info("Ви досягли кінця списку.");
        }
    } else {
        loadMoreBtn.classList.remove('isHidden');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    searchQuery = e.currentTarget.elements.searchQuery.value.trim();

    if (!searchQuery) {
        Notiflix.Notify.failure('Будь ласка, введіть запит для пошуку.');
        return;
    }

    clearGallery();
    currentPage = 1;

    try {
        const data = await fetchImages(searchQuery, currentPage);
        totalHits = data.totalHits;

        if (data.hits.length === 0) {
            Notiflix.Notify.failure('На жаль, за вашим запитом зображень не знайдено. Спробуйте ще раз.');
            return;
        }

        Notiflix.Notify.success(`Ура! Ми знайшли ${totalHits} зображень.`);
        updateGalleryMarkup(data.hits);
        handleLoadMoreVisibility();
    } catch (error) {
        Notiflix.Notify.failure('Помилка при запиті даних: ' + error.message);
    }
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;

    try {
        const data = await fetchImages(searchQuery, currentPage);

        if(data.hits.length === 0) {
Notiflix.Notify.info(“Ви досягли кінця списку.”);
return;
}

    updateGalleryMarkup(data.hits);
    handleLoadMoreVisibility();
} catch (error) {
    Notiflix.Notify.failure('Помилка при запиті даних: ' + error.message);
}

});

loadMoreBtn.classList.add(‘isHidden’);
