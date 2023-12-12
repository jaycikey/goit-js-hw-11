// main.js
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, perPage } from './apiService.js';
import { createCardMarkup } from './markupService.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('loadMore');
let currentPage = 1;
let searchQuery = '';
let totalHits = 0;

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
    currentPage += 1;

    try {
        const data = await fetchImages(searchQuery, currentPage);
        updateGalleryMarkup(data.hits);
        handleLoadMoreVisibility();
    } catch (error) {
        Notiflix.Notify.failure('Помилка при запиті даних: ' + error.message);
    }
});

loadMoreBtn.classList.add('isHidden');
