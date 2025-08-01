document.querySelectorAll(".slider-container").forEach((slider) => {
  const btnLeft = slider.querySelector(".container-box-component--header--list--btn-left");
  const btnRight = slider.querySelector(".container-box-component--header--list--btn-right");
  const list = slider.querySelector(".container-box-component--header--list");

  const scrollStep = 200;

  if (btnLeft && list) {
    btnLeft.addEventListener("click", () => {
      list.scrollLeft -= scrollStep;
    });
  }

  if (btnRight && list) {
    btnRight.addEventListener("click", () => {
      list.scrollLeft += scrollStep;
    });
  }
});

// Tắt hiện bảng history search
document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".header-left_search input");
  const historyBox = document.querySelector(".header-left_search--history");

  if (!input || !historyBox) {
    console.warn("Không tìm thấy input hoặc history box trong DOM. Bỏ qua chức năng search history.");
    return;
  }

  input.addEventListener("focus", () => {
    if (input.value.trim() === "") {
      historyBox.style.setProperty("display", "block", "important");
    }
  });

  input.addEventListener("input", () => {
    historyBox.style.display = "none";
  });

  document.addEventListener("click", function (e) {
    const searchBox = document.querySelector(".header-left_search");
    if (searchBox && !searchBox.contains(e.target)) {
      historyBox.style.display = "none";
    }
  });
});



