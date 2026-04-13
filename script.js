const API_URL = "https://api.jikan.moe/v4/anime";
const FALLBACK_RESULTS = [
  {
    title: "Naruto",
    year: 2002,
    episodes: 220,
    score: 7.99,
    synopsis:
      "A young ninja seeks recognition from his peers and dreams of becoming the Hokage of his village.",
    url: "https://myanimelist.net/anime/20/Naruto",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg",
      },
    },
  },
  {
    title: "Death Note",
    year: 2006,
    episodes: 37,
    score: 8.62,
    synopsis:
      "A brilliant student discovers a notebook that lets him kill anyone whose name he writes in it.",
    url: "https://myanimelist.net/anime/1535/Death_Note",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
      },
    },
  },
  {
    title: "One Piece",
    year: 1999,
    episodes: null,
    score: 8.73,
    synopsis:
      "Monkey D. Luffy sails with his crew across the Grand Line in search of the legendary treasure One Piece.",
    url: "https://myanimelist.net/anime/21/One_Piece",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
      },
    },
  },
];

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
  imageElement.loading = "lazy";
  imageElement.referrerPolicy = "no-referrer";
  imageElement.addEventListener("error", () => {
    imageElement.style.display = "none";
  });

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
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(trimmedQuery)}&limit=24`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    renderResults(payload.data || []);
  } catch (error) {
    container.innerHTML = "";
    renderResults(
      FALLBACK_RESULTS.filter((anime) =>
        anime.title.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
    );
    setStatus(
      "Live anime search is unavailable right now. This can happen on deployed sites if the public API blocks or rate-limits browser requests."
    );
    console.error("Anime search failed:", error);
  } finally {
    searchButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchAnime(input.value);
});

renderResults(FALLBACK_RESULTS);
setStatus("Featured anime loaded. Search to fetch live results.");
