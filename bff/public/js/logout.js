document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout');
    logoutBtn.addEventListener('click', () => {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(res => {
            if (res.redirected) {
                window.location.href = '/';
            }
        });
    });
})