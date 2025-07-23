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

// Tắt hiện bảng hiển thị bắt buộc đăng nhập
const buttonPlaylist = document.querySelector(".container-sidebar_box-AddNewPlaylist--button");
const tooltip = document.querySelector(".tooltip-box");

buttonPlaylist.addEventListener("focus", () => {
  if (buttonPlaylist.value.trim() === "") {
    tooltip.style.display = "block";
  }
});

buttonPlaylist.addEventListener("input", () => {
  tooltip.style.display = "none";
});

// Nếu muốn click ra ngoài thì ẩn luôn history
document.addEventListener("click", function (e) {
  if (!document.querySelector(".container-sidebar_box-AddNewPlaylist--button").contains(e.target)) {
    tooltip.style.display = "none";
  }
});