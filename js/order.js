const orderParams = new URLSearchParams(window.location.search);
const bikeName = orderParams.get("name");
const bikePrice = Number(orderParams.get("price"));
const bikeImageClass = orderParams.get("image");
const bikeAlt = orderParams.get("alt");
const allowedImageClasses = new Set([
  "image-mtb-26",
  "image-mtb-27-5",
  "image-pro-action-tosca",
  "image-pro-action-kuning",
  "image-kalcer-merah",
  "image-kalcer-black-pink",
  "image-kalcer-biru"
]);

const orderLayout = document.querySelector("#order-layout");
const orderError = document.querySelector("#order-error");
const orderForm = document.querySelector("#order-form");
const rentalDurationSelect = document.querySelector("#rental-hours");
const orderTotalPrice = document.querySelector("#order-total-price");
const orderBikePrice = document.querySelector("#order-bike-price");
const orderBikeDuration = document.querySelector("#order-bike-duration");
const bikeImageDialog = document.querySelector("#bike-image-dialog");
const bikeImageDialogPhoto = document.querySelector("#bike-image-dialog-photo");
const bikeImageDialogCaption = document.querySelector("#bike-image-caption");
const bikeImageDialogCloseButton = document.querySelector("#bike-image-dialog-close");
const orderBikeImage = document.querySelector("#order-bike-image");
let previousDocumentOverflow = "";
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});
const whatsappNumber = "6285846243761";

function updateTotal() {
  const selectedOption = rentalDurationSelect.selectedOptions[0];
  const duration = Number(selectedOption.value);
  const price = Number(selectedOption.dataset.price);

  if (!duration || !Number.isSafeInteger(price) || price <= 0) {
    orderBikePrice.textContent = "Pilih durasi";
    orderBikeDuration.textContent = "";
    orderTotalPrice.textContent = "-";
    return;
  }

  orderBikePrice.textContent = currencyFormatter.format(price);
  orderBikeDuration.textContent = `/ ${duration} jam`;
  orderTotalPrice.textContent = currencyFormatter.format(price);
}

function openBikeImageDialog() {
  if (!bikeImageDialog || !bikeImageDialogPhoto || !bikeImageDialogCaption || !bikeImageClass) {
    return;
  }

  bikeImageDialogPhoto.className = `bike-image-dialog-photo ${bikeImageClass}`;
  bikeImageDialogPhoto.setAttribute("aria-label", bikeAlt || `Foto ${bikeName}`);
  bikeImageDialogCaption.textContent = bikeName;
  previousDocumentOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  bikeImageDialog.showModal();
  bikeImageDialogCloseButton.focus();
}

if (
  bikeName &&
  Number.isSafeInteger(bikePrice) &&
  bikePrice > 0 &&
  allowedImageClasses.has(bikeImageClass)
) {
orderBikeImage.classList.add(bikeImageClass);
orderBikeImage.setAttribute("aria-label", bikeAlt || `Foto ${bikeName}`);
document.querySelector("#order-bike-name").textContent = bikeName;
orderLayout.hidden = false;

orderBikeImage.addEventListener("click", openBikeImageDialog);
orderBikeImage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openBikeImageDialog();
  }
});

rentalDurationSelect.addEventListener("change", updateTotal);
updateTotal();

bikeImageDialogCloseButton.addEventListener("click", () => bikeImageDialog.close());
bikeImageDialog.addEventListener("click", (event) => {
  if (event.target === bikeImageDialog) {
    bikeImageDialog.close();
  }
});
bikeImageDialog.addEventListener("close", () => {
  document.documentElement.style.overflow = previousDocumentOverflow;
  orderBikeImage.focus();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!orderForm.reportValidity()) {
    return;
  }

    const formData = new FormData(orderForm);
    const customerName = String(formData.get("customerName")).trim();
    const customerPhone = String(formData.get("customerPhone")).trim();
    const rentalDate = String(formData.get("rentalDate"));
    const selectedOption = rentalDurationSelect.selectedOptions[0];
    const rentalHours = Number(formData.get("rentalHours"));
    const rentalPrice = Number(selectedOption.dataset.price);
    const total = currencyFormatter.format(rentalPrice);
    const message = [
      "Halo PedalPOP, saya ingin memesan sepeda:",
      `Sepeda: ${bikeName}`,
      `Tarif: ${total} / ${rentalHours} jam`,
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
