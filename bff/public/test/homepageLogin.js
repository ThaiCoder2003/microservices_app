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

// phát nhạc
document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.querySelector(
    ".footer-homepage-controls-fa-play"
  );
  const icon = playButton.querySelector("i");
  const audio = document.getElementById("audio");

  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");
  const progressFill = document.getElementById("progressFill");
  const progressBar = document.getElementById("progressBar");

  // Format thời gian (giây -> mm:ss)
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  }

  // Khi người dùng click play/pause
  playButton.addEventListener("click", function () {
    const isPlaying = icon.classList.contains("fa-pause");

    if (isPlaying) {
      // Đang pause => đổi thành play, dừng nhạc
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
      audio.pause();
    } else {
      // Đang play => đổi thành pause, phát nhạc
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
      audio.play();
    }
  });

  // Cập nhật thời gian và thanh tiến trình khi phát nhạc
  audio.addEventListener("timeupdate", function () {
    const current = audio.currentTime;
    const duration = audio.duration;

    currentTimeDisplay.textContent = formatTime(current);
    durationDisplay.textContent = formatTime(duration);

    const progressPercent = (current / duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
  });

  // Gán thời lượng ban đầu khi file load xong
  audio.addEventListener("loadedmetadata", function () {
    durationDisplay.textContent = formatTime(audio.duration);
  });

  // Cho phép người dùng click vào thanh để tua
  progressBar.addEventListener("click", function (e) {
    const barWidth = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / barWidth) * duration;
  });
});
//   box 3
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("searchWrapper");
  const input = document.getElementById("searchInput");
  const icon = document.getElementById("searchIcon");

  icon.addEventListener("click", () => {
    wrapper.classList.toggle("expanded");
    if (wrapper.classList.contains("expanded")) {
      input.focus();
    }
  });
});
// Box1
const box1_list = document.getElementById("box1_list");
const sidebar_box1 = document.getElementById("sidebar_box1");

sidebar_box1.addEventListener("click", function (e) {
  e.stopPropagation(); // Ngăn không lan sự kiện click ra ngoài
  const isVisible = box1_list.style.display === "block";
  box1_list.style.display = isVisible ? "none" : "block";
});

// Click bên ngoài dropdown thì ẩn nó
document.addEventListener("click", function () {
  box1_list.style.display = "none";
});

// Nếu click vào trong dropdown, không ẩn
box1_list.addEventListener("click", function (e) {
  e.stopPropagation();
});

// menu sort
const sortMenu = document.querySelector(".container-sidebar_box3-sort-menu");
const options = sortMenu.querySelectorAll(
  ".container-sidebar_box3-sort-option"
);

options.forEach((option) => {
  option.addEventListener("click", () => {
    options.forEach((opt) => {
      opt.classList.remove("selected");
      const check = opt.querySelector(".container-sidebar_box3-checkmark");
      if (check) check.remove();
    });

    option.classList.add("selected");

    if (!option.querySelector(".container-sidebar_box3-checkmark")) {
      const checkmark = document.createElement("span");
      checkmark.classList.add("container-sidebar_box3-checkmark");
      checkmark.textContent = "✔";
      option.appendChild(checkmark);
    }
  });
});

//bật tắt list sort
const sortToggle = document.querySelector(".container-sidebar_box3-sort");
const sortMenuClick = document.querySelector(
  ".container-sidebar_box3-sort-menu"
);

sortToggle.addEventListener("click", function (e) {
  setTimeout(() => {
    sortMenuClick.style.display = "block";
  }, 0);
});

document.addEventListener("click", function () {
  sortMenuClick.style.display = "none";
});

// button control
document.addEventListener("DOMContentLoaded", function () {
  const btn1 = document.querySelectorAll(".footer-homepage-controls-btn")[0]; // button 1
  const btn5 = document.querySelector(".footer-homepage-controls-btn-repeat"); // button 5
  const btn6 = document.querySelector(".footer-homepage-controls-btn-repeat1"); // button 6

  const ACTIVE_CLASS = "footer-homepage-controls-active";

  // Toggle class cho button bất kỳ
  function toggleClass(button) {
    button.classList.toggle(ACTIVE_CLASS);
  }

  // Button 1: chỉ toggle class
  btn1.addEventListener("click", function () {
    toggleClass(btn1);
  });

  // Button 5: toggle class + loại bỏ active ở btn6 nếu đang bật
  btn5.addEventListener("click", function () {
    const isActive = btn5.classList.contains(ACTIVE_CLASS);
    toggleClass(btn5);
    if (!isActive) {
      btn6.classList.remove(ACTIVE_CLASS);
    }
  });

  // Button 6: toggle class + loại bỏ active ở btn5 nếu đang bật
  btn6.addEventListener("click", function () {
    const isActive = btn6.classList.contains(ACTIVE_CLASS);
    toggleClass(btn6);
    if (!isActive) {
      btn5.classList.remove(ACTIVE_CLASS);
    }
  });
});
// chỉnh âm lượng volume
const volumeIcon = document.querySelector(
  ".footer-homepage-right-btn--valume i"
);
const volumeSlider = document.querySelector(
  ".footer-homepage-right-volume-bar"
);
const audio = document.getElementById("audio");

function updateVolumeIcon(volume) {
  if (volume === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  } else if (volume > 0 && volume <= 30) {
    volumeIcon.className = "fa-solid fa-volume-off";
  } else if (volume > 30 && volume <= 70) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
}

// Khi kéo thanh volume
volumeSlider.addEventListener("input", () => {
  const volume = parseInt(volumeSlider.value);
  updateVolumeIcon(volume);

  if (audio) {
    audio.volume = volume / 100;
  }
});

// Khi click vào icon loa để tắt tiếng
volumeIcon.parentElement.addEventListener("click", () => {
  volumeSlider.value = 0;
  updateVolumeIcon(0);

  if (audio) {
    audio.volume = 0;
  }
});

function updateVolumeSliderColor(slider) {
  const value = slider.value;
  slider.style.background = `linear-gradient(to right, #1db954 ${value}%, #ccc ${value}%)`;
}

// Gọi khi trang tải
updateVolumeSliderColor(volumeSlider);

// Gọi khi kéo thanh
volumeSlider.addEventListener("input", function () {
  updateVolumeSliderColor(this);
});

// sidebar left
const playlistItems = document.querySelectorAll(
  ".container-sidebar_box4-playlist--item"
);

playlistItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Xoá class 'selected' khỏi tất cả item
    playlistItems.forEach((i) => {
      i.classList.remove("selected");

      // Ẩn liked-song-icon nếu có
      const icon = i.querySelector(".liked-song-icon");
      if (icon) icon.remove();
    });

    // Thêm class 'selected' vào item được click
    item.classList.add("selected");

    // Tạo liked-song-icon nếu chưa có
    if (!item.querySelector(".liked-song-icon")) {
      const likedIcon = document.createElement("div");
      likedIcon.classList.add("liked-song-icon");
      likedIcon.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
      item.appendChild(likedIcon);
    }
  });
});
