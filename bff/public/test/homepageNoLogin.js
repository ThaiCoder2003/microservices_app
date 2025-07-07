document.querySelectorAll(".slider-container").forEach((slider) => {
  const btnLeft = slider.querySelector(
    ".container-box-component--header--list--btn-left"
  );
  const btnRight = slider.querySelector(
    ".container-box-component--header--list--btn-right"
  );
  const list = slider.querySelector(".container-box-component--header--list");

  let scrollAmount = 0;
  const scrollStep = 200; // hoặc tùy bạn

  btnLeft.addEventListener("click", () => {
    list.scrollLeft -= scrollStep;
  });

  btnRight.addEventListener("click", () => {
    list.scrollLeft += scrollStep;
  });
});

// Tắt hiện bảng history search
const input = document.querySelector(".header-left_search input");
const historyBox = document.querySelector(".header-left_search--history");

input.addEventListener("focus", () => {
  if (input.value.trim() === "") {
    historyBox.style.display = "block";
  }
});

input.addEventListener("input", () => {
  historyBox.style.display = "none";
});

document.addEventListener("click", function (e) {
  if (!document.querySelector(".header-left_search").contains(e.target)) {
    historyBox.style.display = "none";
  }
});
