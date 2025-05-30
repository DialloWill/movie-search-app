const API_KEY = '582c99df85fe6740b2ce67bdb997e30e';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesDiv = document.getElementById('movies');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

async function fetchMovies(query) {
  moviesDiv.innerHTML = '<p>Loading...</p>';
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results.length === 0) {
      moviesDiv.innerHTML = '<p>No movies found.</p>';
      return;
    }

    moviesDiv.innerHTML = data.results
      .map(movie => `
        <div class="movie-card" title="${movie.overview || 'No description'}">
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path || ''}" alt="${movie.title}" />
          <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-date">${movie.release_date || 'Unknown'}</div>
          </div>
        </div>
      `).join('');
  } catch (error) {
    moviesDiv.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
  }
}
