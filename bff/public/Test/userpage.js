  const toggleBtn = document.getElementById("toggleHistoryBtn");
  const orderHistory = document.getElementById("orderHistory");

  toggleBtn.addEventListener("click", () => {
    const isVisible = orderHistory.style.display === "block";
    orderHistory.style.display = isVisible ? "none" : "block";
    toggleBtn.textContent = isVisible ? "Xem lịch sử đặt hàng" : "Ẩn lịch sử đặt hàng";
  });

  const editBtn = document.querySelector(".btn-userPage.edit-userPage");
  const editOverlay = document.getElementById("editOverlay");
  const cancelBtn = document.getElementById("cancelEdit");
  const editForm = document.getElementById("editForm");

  editBtn.addEventListener("click", () => {
    editOverlay.style.display = "flex";
  });

  cancelBtn.addEventListener("click", () => {
    editOverlay.style.display = "none";
  });

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    // Update the values in the profile
    document.querySelector(".info-group-userPage p:nth-child(1)").innerHTML = `<strong>Số điện thoại:</strong> ${phone}`;
    document.querySelector(".info-group-userPage p:nth-child(2)").innerHTML = `<strong>Địa chỉ:</strong> ${address}`;

    editOverlay.style.display = "none";
  });   