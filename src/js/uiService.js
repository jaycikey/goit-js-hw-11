// uiService.js
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, perPage } from './apiService.js'; // Імпорт perPage

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('loadMore');
let currentPage = 1;
let searchQuery = '';
let totalHits = 0;

// Функція для створення HTML розмітки однієї картки
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

// Очищення галереї
function clearGallery() {
    gallery.innerHTML = '';
}

// Оновлення HTML розмітки галереї
function updateGalleryMarkup(images) {
    const markup = images.map(createCardMarkup).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    new SimpleLightbox('.gallery a').refresh();
}

// Управління видимістю кнопки "Load more"
function handleLoadMoreVisibility() {
    if (currentPage * perPage < totalHits) {
        loadMoreBtn.classList.remove('isHidden');
    } else {
        loadMoreBtn.classList.add('isHidden');
    }
}

// Обробка події відправки форми
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

// Обробка події натискання кнопки "Load more"
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

// Початкове приховування кнопки "Load more"
loadMoreBtn.classList.add('isHidden');
