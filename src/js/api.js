import axios from 'axios';

const BASE_API = 'https://pixabay.com/api/';
const API_KEY = '37247568-35df7f081861af6a3ea79c4b1';

async function loadImages(page = 1, perPage, query) {
  const API_KEY = '37247568-35df7f081861af6a3ea79c4b1';
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });
  return await axios.get(`${BASE_API}?${searchParams}`);
}

export { loadImages };
