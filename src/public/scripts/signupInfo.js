(function () {
  let emailCheck = false;
  let nicknameCheck = false;
  let passwordCheck = false;
  let birthCheck = false;

  // sign up
  async function signUp(data) {
    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return res;
    } catch (err) {
      console.error(e);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!emailCheck || !nicknameCheck || !passwordCheck || !birthCheck) return;

    const $emailInput = document.querySelector('input#email');
    const $nicknameInput = document.querySelector('input#nickname');
    const $passwordInput = document.querySelector('input#password');
    const $birthInput = document.querySelector('input#birth');

    const value = {
      email: $emailInput.value,
      nickname: $nicknameInput.value,
      password: $passwordInput.value,
      birth: $birthInput.value,
    };
    try {
      const res = await signUp(value);
      if (res.ok) {
        alert('회원가입 완료');
        location.href = '/';
      } else {
        const data = await res.json();
        if (res.status === 409) alert(data);
        else alert('서버 오류. 다시 시도해주세요');
      }
    } catch (err) {
      console.error(e);
    }
  }

  // activate next step
  function checkAllInfoFilled() {
    const nextBtn = document.querySelector('a.next-btn');

    if (
      emailCheck === true &&
      nicknameCheck === true &&
      passwordCheck === true &&
      birthCheck === true
    ) {
      nextBtn.classList.remove('inactive');
    } else {
      if (nextBtn.classList.contains('inactive') === false) {
        // 활성화 상태인경우, 비활성화
        nextBtn.classList.add('inactive');
      }
    }
  }

  // remove entire input
  function handleRemoveClickListener(e) {
    if (!e.target.classList.contains('input-container')) return ;
      
    const $inputContainer = e.target;
    const $input = $inputContainer.querySelector('input');

    $input.value = '';
    $input.focus();
  }

  // change valid check status
  function toggleCheck($this, isPassed) {
    const $inputContainer = $this.closest('.input-container');
    const $img = $inputContainer.querySelector('.validation img');
    const icon = $img.src.split('/')[2];

    if (isPassed) {
      if (icon.startsWith('검증_T') === false) {
        $img.src = '/image/검증_T.png';
        isPhoneNumberFull = true;
      }
    } else {
      if (icon.startsWith('검증_F') === false) {
        $img.src = '/image/검증_F.png';
        isPhoneNumberFull = false;
      }
    }
  }

  // on / off remove button of each input 
  function handleInputFocusListener(e) {
    const $inputContainer = e.target.closest('.input-container');
    const $reset = $inputContainer.querySelector('.reset');

    if (e.type === 'focusin') {
      $reset.classList.remove('hidden');
    } else if (e.type === 'blur') {
      $reset.classList.add('hidden');
    }
  }

  // nickname validation
  function handleNickNameInputListener(e) {
    const { value } = e.target;
    if (value === '' || value === null) {
      toggleCheck(this, false);
      nicknameCheck = false;
    } else {
      toggleCheck(this, true);
      nicknameCheck = true;
    }
    checkAllInfoFilled();
  }

  // email validation
  function emailValidation(email) {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
  }

  async function emailDuplicateCheck(email) {
    try {
        const res = await fetch('/auth/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });
        return res;
      } catch (e) {
        console.error(e);
      }
  }

  async function handleDuplicateCheckListener(e) {
    e.preventDefault();

    const $nickname = document.querySelector('.input-container.nickname');
    const $password = document.querySelector('.input-container.password');
    const $birth = document.querySelector('.input-container.birth');

    const $inputContainer = e.target.closest('.input-container');
    const $emailInput = $inputContainer.querySelector('input#email');
    const $emailValidation = document.querySelector('.email-validation');

    const { value } = $emailInput;
    
    if (emailValidation(value) === false) {
      alert('올바르지 않은 이메일 형식입니다');
      toggleCheck(this, false);
      emailCheck = false;
    } else {
        try {
            const res = await emailDuplicateCheck(value);
            const data = await res.json();

            if (res.ok) {
                alert(data);

                $emailValidation.classList.remove('hidden');
                toggleCheck(this, true);
                emailCheck = true;
                checkAllInfoFilled();

                $nickname.classList.remove('hidden');
                $password.classList.remove('hidden');
                $birth.classList.remove('hidden');
            } else {
                if (res.status === 409) alert(data);
                else alert('서버 오류. 다시 시도해주세요');
            }
        } catch (e) {
            console.error(e);
        }
    }
  }

  // password validation
  function checkNoContinuousNumber(password) {
    const sameNumberCondition = [
      '000',
      '111',
      '222',
      '333',
      '444',
      '555',
      '666',
      '777',
      '888',
      '999',
    ];
    const continuousCondition = [
      '012',
      '123',
      '234',
      '345',
      '456',
      '567',
      '678',
      '789',
    ];

    function strReverse(str) {
      return str.split('').reverse().join('');
    }

    const resultSameNumber = sameNumberCondition.every(
      (value) => password.indexOf(value) === -1,
    );
    if (resultSameNumber === false) return false;

    const resultContinuous = continuousCondition.every(
      (value) =>
        password.indexOf(value) === -1 &&
        password.indexOf(strReverse(value)) === -1,
    );
    if (resultContinuous === false) return false;

    return true;
  }

  function checkAtLeastTwoTypesExist(password) {
    const types = {
      upper: 0,
      lower: 0,
      num: 0,
      special: 0,
    };

    function characterFilter(c) {
      if ('a' <= c && c <= 'z') {
        types.lower = 1;
      } else if ('A' <= c && c <= 'Z') {
        types.upper = 1;
      } else if ('0' <= c && c <= '9') {
        types.num = 1;
      } else {
        types.special = 1;
      }
    }

    password.split('').forEach((char) => {
      characterFilter(char);
    });
    const typeCount = Object.values(types).reduce(
      (total, exist) => total + exist,
      0,
    );

    return typeCount >= 2;
  }

  function passwordValidationCheck(password) {
    if (password.length < 10) return false;
    if (checkAtLeastTwoTypesExist(password) === false) return false;
    if (checkNoContinuousNumber(password) === false) return false;

    return true;
  }

  function handlePasswordInputListener(e) {
    const { value: password } = e.target;
    const $error = document.querySelector('.input-container.password .error');

    if (passwordValidationCheck(password)) {
      if ($error.classList.contains('hidden') === false) {
        $error.classList.add('hidden');
      }
      passwordCheck = true;
      toggleCheck(this, true);
    } else {
      $error.classList.remove('hidden');
      passwordCheck = false;
      toggleCheck(this, false);
    }
    checkAllInfoFilled();
  }

  // birth validation
  function verifyBirth(birth) {
    const [_, month, date] = birth.split('.').map(Number);
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      if (date <= 31) {
        return true;
      }
    } else if (month === 2) {
      if (date <= 29) {
        return true;
      }
    } else if (month <= 12) {
      if (date <= 30) {
        return true;
      }
    }
    return false;
  }

  function handleBirthInputListener(e) {
    if (e.inputType === 'deleteContentBackward') {
      if (this.value.length === 4 || this.value.length === 7) {
        this.value = this.value.slice(0, this.value.length - 1);
      }
      toggleCheck(this, false);
      return;
    }

    const $error = document.querySelector('.input-container.birth .error');
    const { value } = e.target;

    if (value.length < 10) {
      $error.classList.remove('hidden');
      toggleCheck(this, false);
      birthCheck = false;
    } else {
      if (verifyBirth(this.value) === true) {
        $error.classList.add('hidden');
        toggleCheck(this, true);
        birthCheck = true;
      } else {
        $error.classList.remove('hidden');
        toggleCheck(this, false);
        birthCheck = false;
      }
    }
    checkAllInfoFilled();

    this.value = this.value.replace(/[^0-9.]/g, '');

    if (value.length === 4) {
      // 2000.
      this.value = value + '.';
    } else if (value.length === 7) {
      // 2000.05.
      this.value = value + '.';
    }
  }

  // listeners
  const $form = document.querySelector('.signup-info-container');
  const $emailInput = document.querySelector('input#email');
  const $nicknameInput = document.querySelector('input#nickname');
  const $passwordInput = document.querySelector('input#password');
  const $birthInput = document.querySelector('input#birth');
  const $duplicateCheckBtn = document.querySelector('.duplicate-check');
  const $signUpBtn = document.querySelector('.next-btn');
  const $reset = document.querySelector('.reset');

  $form.addEventListener('click', handleRemoveClickListener);
//   $form.addEventListener('focusin', handleInputFocusListener);

  $emailInput.addEventListener('focusin', handleInputFocusListener);
  $emailInput.addEventListener('blur', handleInputFocusListener);

  $nicknameInput.addEventListener('focusin', handleInputFocusListener);
  $nicknameInput.addEventListener('blur', handleInputFocusListener);
  $nicknameInput.addEventListener('input', handleNickNameInputListener);

  $passwordInput.addEventListener('focusin', handleInputFocusListener);
  $passwordInput.addEventListener('blur', handleInputFocusListener);
  $passwordInput.addEventListener('input', handlePasswordInputListener);

  $birthInput.addEventListener('focusin', handleInputFocusListener);
  $birthInput.addEventListener('blur', handleInputFocusListener);
  $birthInput.addEventListener('input', handleBirthInputListener);

  $duplicateCheckBtn.addEventListener('click', handleDuplicateCheckListener);
  $signUpBtn.addEventListener('click', handleSignUp);
})();
