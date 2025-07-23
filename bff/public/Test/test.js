document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.container-admin-sidebarItem');
  const panes = document.querySelectorAll('.container-admin-content-pane');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.target;

      // Xoá active ở tất cả item & pane
      menuItems.forEach(i => i.classList.remove('container-admin-content-active'));
      panes.forEach(p => p.classList.remove('container-admin-content-active'));

      // Thêm active đúng mục được chọn
      item.classList.add('container-admin-content-active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('container-admin-content-active');
    });
  });
});