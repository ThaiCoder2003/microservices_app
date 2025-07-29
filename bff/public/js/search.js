document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  input?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      window.location.href = `/search?q=${encodeURIComponent(this.value)}`;
    }
  });
});