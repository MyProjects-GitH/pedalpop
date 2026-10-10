const orderParams = new URLSearchParams(window.location.search);
const bikeName = orderParams.get("name");
const bikePrice = Number(orderParams.get("price"));
const bikeImageClass = orderParams.get("image");
const bikeAlt = orderParams.get("alt");
const allowedImageClasses = new Set([
  "image-trail",
  "image-city",
  "image-trek",
  "image-siskiu",
  "image-miami",
  "image-pacific"
]);
const orderLayout = document.querySelector("#order-layout");
const orderError = document.querySelector("#order-error");
const orderForm = document.querySelector("#order-form");
const rentalHoursInput = document.querySelector("#rental-hours");
const orderTotalPrice = document.querySelector("#order-total-price");
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});
const whatsappNumber = "6285846243761";

function updateTotal() {
  const hours = Number(rentalHoursInput.value);
  orderTotalPrice.textContent = currencyFormatter.format(bikePrice * hours);
}

if (
  bikeName &&
  Number.isSafeInteger(bikePrice) &&
  bikePrice > 0 &&
  allowedImageClasses.has(bikeImageClass)
) {
  const bikeImage = document.querySelector("#order-bike-image");
  bikeImage.classList.add(bikeImageClass);
  bikeImage.setAttribute("aria-label", bikeAlt || `Foto ${bikeName}`);
  document.querySelector("#order-bike-name").textContent = bikeName;
  document.querySelector("#order-bike-price").textContent = currencyFormatter.format(bikePrice);
  orderLayout.hidden = false;

  rentalHoursInput.addEventListener("input", updateTotal);
  updateTotal();

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderForm.reportValidity()) {
      return;
    }

    const formData = new FormData(orderForm);
    const customerName = String(formData.get("customerName")).trim();
    const customerPhone = String(formData.get("customerPhone")).trim();
    const rentalDate = String(formData.get("rentalDate"));
    const rentalHours = Number(formData.get("rentalHours"));
    const total = currencyFormatter.format(bikePrice * rentalHours);
    const message = [
      "Halo PedalPOP, saya ingin memesan sepeda:",
      `Sepeda: ${bikeName}`,
      `Tarif: ${currencyFormatter.format(bikePrice)} / jam`,
      `Tanggal sewa: ${rentalDate}`,
      `Durasi: ${rentalHours} jam`,
      `Total: ${total}`,
      `Nama: ${customerName}`,
      `Nomor WhatsApp: ${customerPhone}`
    ].join("\n");

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });
} else {
  orderError.hidden = false;
  orderForm.hidden = true;
}

if (window.lucide) {
  window.lucide.createIcons();
}
