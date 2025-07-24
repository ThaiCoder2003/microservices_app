 document.addEventListener("DOMContentLoaded", function () {
    const quantityWrappers = document.querySelectorAll(".container-box-content-cart-quantity");

    quantityWrappers.forEach(wrapper => {
      const decrementBtn = wrapper.querySelector(".decrement");
      const incrementBtn = wrapper.querySelector(".increment");
      const input = wrapper.querySelector(".container-box-content-cart-quantity-input");

      decrementBtn.addEventListener("click", () => {
        let currentValue = parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });

      incrementBtn.addEventListener("click", () => {
        let currentValue = parseInt(input.value);
        input.value = currentValue + 1;
      });
    });
  });