(function () {
  const loginContent = document.querySelector('.login-content'),
    form = loginContent.querySelector('form'),
    emailIpt = form.querySelector('.email'),
    passwordIpt = form.querySelector('.password'),
    error = form.querySelector('.error');
  const login = async (e) => {
    e.preventDefault();
    const email = emailIpt.value;
    const password = passwordIpt.value;
    if (!email) {
      error.innerHTML = '이메일을 입력하세요';
    } else if (!password) {
      error.innerHTML = '비밀번호를 입력하세요';
    } else {
      try {
        await fetch('auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        location.href = '/';
      } catch (e) {
        if (e.response.data) error.innerHTML = e.response.data;
        else console.error(e);
        // 409면 이메일 또는 비밀번호가 틀립니다
      }
    }
  };
  form.addEventListener('submit', login);
})();
