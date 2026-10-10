const searchForm = document.querySelector("#bike-search");
const searchInput = document.querySelector("#search-input");
const bikeCards = [...document.querySelectorAll(".bike-card")];
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const priceSortDescendingButton = document.querySelector("#price-sort-desc");
const priceSortAscendingButton = document.querySelector("#price-sort-asc");
const resetFilterButton = document.querySelector("#reset-filter");
const bikeGrid = document.querySelector("#bike-grid");
const orderButtons = document.querySelectorAll(".order-button");
let sortDescending = null;

function filterBikes() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  let visibleCount = 0;

  for (const card of bikeCards) {
    const matches = card.dataset.search.includes(query);
    card.hidden = !matches;
    visibleCount += Number(matches);
  }

  const sortedCards = sortDescending === null
    ? bikeCards
    : [...bikeCards].sort((first, second) => {
      const priceDifference = Number(first.dataset.price) - Number(second.dataset.price);
      return sortDescending ? -priceDifference : priceDifference;
    });

  for (const card of sortedCards) {
    bikeGrid.append(card);
  }

  resultCount.textContent = `${visibleCount} sepeda`;
  emptyState.hidden = visibleCount > 0;
}

function updatePriceSort(direction) {
  sortDescending = direction;
  updatePriceSortButtons();
  filterBikes();
}

function updatePriceSortButtons() {
  priceSortDescendingButton.setAttribute("aria-pressed", String(sortDescending === true));
  priceSortAscendingButton.setAttribute("aria-pressed", String(sortDescending === false));
}

function resetFilters() {
  searchInput.value = "";
  sortDescending = null;
  updatePriceSortButtons();
  filterBikes();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterBikes();
});

searchInput.addEventListener("input", filterBikes);
priceSortDescendingButton.addEventListener("click", () => updatePriceSort(true));
priceSortAscendingButton.addEventListener("click", () => updatePriceSort(false));
resetFilterButton.addEventListener("click", resetFilters);

for (const button of orderButtons) {
  button.addEventListener("click", () => {
    const card = button.closest(".bike-card");
    const image = card.querySelector(".bike-image");
    const imageClass = [...image.classList].find((className) => className.startsWith("image-"));
    const orderDetails = new URLSearchParams({
      name: card.querySelector("h3").textContent.trim(),
      price: card.dataset.price,
      image: imageClass,
      alt: image.getAttribute("aria-label")
    });

    window.location.href = `pesan.html?${orderDetails.toString()}`;
  });
}

filterBikes();

if (window.lucide) {
  window.lucide.createIcons();
}