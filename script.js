const API_URL = "https://api.jikan.moe/v4/anime";

const container = document.getElementById("container");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const statusText = document.getElementById("status");
const searchButton = document.getElementById("search-button");

function setStatus(message) {
  statusText.textContent = message;
}

function createCard(anime) {
  const card = document.createElement("article");
  card.className = "card";

  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
  const year = anime.year || "Unknown year";
  const episodes = anime.episodes ? `${anime.episodes} episodes` : "Episodes unknown";
  const score = anime.score ? `⭐ ${anime.score}` : "Not rated yet";
  const synopsis = anime.synopsis
    ? `${anime.synopsis.slice(0, 120)}${anime.synopsis.length > 120 ? "..." : ""}`
    : "No synopsis available.";

  const imageElement = document.createElement("img");
  imageElement.src = image;
  imageElement.alt = anime.title;

  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = anime.title;

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = `${year} • ${episodes}`;

  const scoreBadge = document.createElement("div");
  scoreBadge.className = "card-score";
  scoreBadge.textContent = score;

  const synopsisText = document.createElement("p");
  synopsisText.className = "card-meta";
  synopsisText.textContent = synopsis;

  const link = document.createElement("a");
  link.className = "card-link";
  link.href = anime.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View details";

  content.append(title, meta, scoreBadge, synopsisText, link);
  card.append(imageElement, content);

  return card;
}

function renderResults(results) {
  container.innerHTML = "";

  if (!results.length) {
    setStatus("No anime found. Try a different title.");
    return;
  }

  const fragment = document.createDocumentFragment();
  results.forEach((anime) => {
    fragment.appendChild(createCard(anime));
  });

  container.appendChild(fragment);
  setStatus(`Showing ${results.length} result${results.length === 1 ? "" : "s"}.`);
}

async function searchAnime(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    container.innerHTML = "";
    setStatus("Type an anime name to start searching.");
    return;
  }

  searchButton.disabled = true;
  setStatus(`Searching for "${trimmedQuery}"...`);

  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(trimmedQuery)}&limit=12`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    renderResults(payload.data || []);
  } catch (error) {
    container.innerHTML = "";
    setStatus("Search failed. Please check your internet connection and try again.");
    console.error("Anime search failed:", error);
  } finally {
    searchButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchAnime(input.value);
});

searchAnime("Naruto");
