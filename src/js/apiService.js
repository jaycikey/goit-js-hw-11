// apiService.js
import axios from 'axios';

const API_KEY = '41182373-dd53562a9c0a76d4afd77cafd';
const BASE_URL = 'https://pixabay.com/api/';
export const perPage = 40;

export async function fetchImages(query, page = 1) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}
