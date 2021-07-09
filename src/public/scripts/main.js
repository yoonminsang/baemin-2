(function () {
  const logoutBtn = document.querySelector('.logout');
  const logout = async () => {
    try {
      const res = await fetch('/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        location.href = '/';
      } else {
        alert('서버 오류. 다시 시도해주세요');
      }
    } catch (e) {
      console.error(e);
    }
  };
  logoutBtn.addEventListener('click', logout);
})();
