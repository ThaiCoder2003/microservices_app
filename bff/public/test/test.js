  const sortMenu = document.getElementById("sortMenu");
  const options = sortMenu.querySelectorAll(".sort-option");

  options.forEach(option => {
    option.addEventListener("click", () => {
      // Bỏ selected ở tất cả mục
      options.forEach(opt => {
        opt.classList.remove("selected");
        const check = opt.querySelector(".checkmark");
        if (check) check.remove(); // Xoá dấu ✔ cũ nếu có
      });

      // Gán selected cho mục được click
      option.classList.add("selected");

      // Thêm dấu ✔ nếu chưa có
      if (!option.querySelector(".checkmark")) {
        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");
        checkmark.textContent = "✔";
        option.appendChild(checkmark);
      }
    });
  });

