const avatarBtn = document.getElementById("avatarBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

avatarBtn.addEventListener("click", function (e) {
  e.stopPropagation(); // Ngăn không lan sự kiện click ra ngoài
  const isVisible = dropdownMenu.style.display === "block";
  dropdownMenu.style.display = isVisible ? "none" : "block";
});

// Click bên ngoài dropdown thì ẩn nó
document.addEventListener("click", function () {
  dropdownMenu.style.display = "none";
});

// Nếu click vào trong dropdown, không ẩn
dropdownMenu.addEventListener("click", function (e) {
  e.stopPropagation();
});