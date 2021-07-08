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
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        if (res.ok) {
          console.log('로그인 성공');
          location.href = '/';
        } else {
          const data = await res.json();
          if (res.status === 409) alert(data);
          else alert('서버 오류. 다시 시도해주세요');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
  form.addEventListener('submit', login);
})();
