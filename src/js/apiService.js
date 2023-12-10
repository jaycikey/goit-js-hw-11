// apiService.js
import axios from 'axios';

// Ключ API та базовий URL
const API_KEY = '41182373-dd53562a9c0a76d4afd77cafd';
const BASE_URL = 'https://pixabay.com/api/';
export const perPage = 40; // Експорт perPage

// Асинхронна функція для отримання зображень з API
export async function fetchImages(query, page = 1) {
    try {
        const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
        const response = await axios.get(url);

        if (response.data && response.data.hits) {
            return response.data;
        } else {
            return { hits: [], totalHits: 0 };
        }
    } catch (error) {
        throw error;
    }
}
