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
let endOfResultsReached = false;

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
        </div>
    `;
}

function updateGalleryMarkup(images) {
    const markup = images.map(createCardMarkup).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.gallery a').refresh();
}

function clearGallery() {
    gallery.innerHTML = '';
    endOfResultsReached = false;
}

function handleLoadMoreVisibility() {
    if (currentPage * perPage < totalHits && !endOfResultsReached) {
        loadMoreBtn.classList.remove('isHidden');
    } else {
        loadMoreBtn.classList.add('isHidden');
        if (endOfResultsReached) {
            Notiflix.Notify.info('Ви досягли кінця списку.');
        }
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
    endOfResultsReached = false;

    try {
        const data = await fetchImages(searchQuery, currentPage);

        if (data.hits.length === 0) {
            Notiflix.Notify.failure('На жаль, за вашим запитом зображень не знайдено. Спробуйте ще раз.');
            loadMoreBtn.classList.add('isHidden');
            return;
        }

        totalHits = data.totalHits;
        Notiflix.Notify.success(`Ура! Ми знайшли ${totalHits} зображень.`);
        updateGalleryMarkup(data.hits);
        handleLoadMoreVisibility();
    } catch (error) {
        Notiflix.Notify.failure('Помилка при запиті даних: ' + error.message);
    }
});

loadMoreBtn.addEventListener('click', async () => {
    if (endOfResultsReached) return;

    currentPage += 1;

    try {
        const data = await fetchImages(searchQuery, currentPage);

        if (data.hits.length === 0) {
            endOfResultsReached = true;
handleLoadMoreVisibility();
return;
}

    updateGalleryMarkup(data.hits);
    handleLoadMoreVisibility();
} catch (error) {
    Notiflix.Notify.failure('Помилка при запиті даних: ' + error.message);
}

});

loadMoreBtn.classList.add(‘isHidden’);