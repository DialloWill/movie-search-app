const apiKey = "582c99df85fe6740b2ce67bdb997e30e";
const searchInput = document.getElementById("searchInput");
const movieResults = document.getElementById("movieResults");
const loading = document.getElementById("loading");

searchInput.addEventListener("keyup", (e) => {
  const query = e.target.value.trim();
  if (query.length > 2) {
    fetchMovies(query);
  } else {
    movieResults.innerHTML = "";
    loading.classList.add("hidden");
  }
});

let currentFetchController = null; // To cancel previous fetches if needed

async function fetchMovies(query) {
  if (currentFetchController) {
    currentFetchController.abort();
  }
  currentFetchController = new AbortController();
  const signal = currentFetchController.signal;

  loading.classList.remove("hidden");
  movieResults.innerHTML = "";

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    displayMovies(data.results);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Failed to fetch movies:", error);
      movieResults.innerHTML = `<p style="text-align:center; color:#f44336;">Error fetching movies. Try again later.</p>`;
    }
  } finally {
    loading.classList.add("hidden");
  }
}

function displayMovies(movies) {
  movieResults.innerHTML = "";

  if (!movies || movies.length === 0) {
    movieResults.innerHTML = "<p style='text-align:center;'>No movies found.</p>";
    return;
  }

  movies.forEach((movie, index) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.style.animationDelay = `${index * 80}ms`;

    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : "https://via.placeholder.com/200x300?text=No+Image";

    card.innerHTML = `
      <img src="${posterPath}" alt="${movie.title}" />
      <div class="movie-title">${movie.title}</div>
      <div>Release: ${movie.release_date || "N/A"}</div>
    `;

    movieResults.appendChild(card);
  });
}
