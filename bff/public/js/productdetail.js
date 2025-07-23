document.addEventListener("DOMContentLoaded", function () {
  const filterGroups = document.querySelectorAll(
    ".container-sidebar-right-filter-list"
  );

  filterGroups.forEach((group) => {
    const items = group.querySelectorAll(
      ".container-sidebar-right-filter-item"
    );

    items.forEach((item) => {
      item.addEventListener("click", () => {
        // Nếu là đang active → bỏ chọn và update header nếu là danh mục
        if (item.classList.contains("active")) {
          item.classList.remove("active");

          // Nếu là nhóm danh mục → reset tiêu đề
          if (group.dataset.group === "category") {
            updateHeaderText(""); // Trở về "Sản phẩm"
          }
        } else {
          // Bỏ active tất cả trong nhóm rồi set lại
          items.forEach((i) => i.classList.remove("active"));
          item.classList.add("active");

          // Nếu là nhóm danh mục → cập nhật tiêu đề
          if (group.dataset.group === "category") {
            updateHeaderText(item.textContent.trim());
          }
        }
      });
    });
  });

  // Hàm đổi tiêu đề
  function updateHeaderText(categoryName) {
    const header = document.querySelector(
      ".container-box-component--header--text"
    );
    if (header) {
      header.textContent = categoryName
        ? `Sản phẩm ${categoryName}`
        : "Sản phẩm";
    }
  }
});
