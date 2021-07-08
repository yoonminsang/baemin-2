(function () {
  let emailCheck = false;
  let nicknameCheck = false;
  let passwordCheck = false;
  let birthCheck = false;

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
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(value),
      });
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

  function handleRemoveClickListener(e) {
    const $input = document.querySelector('input#phone');

    $input.value = '';
    $input.focus();
  }

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

  function handleInputFocusListener(e) {
    const $inputContainer = e.target.closest('.input-container');
    const $reset = $inputContainer.querySelector('.reset');
    if (e.type === 'focusin') {
      $reset.classList.remove('hidden');
    } else if (e.type === 'blur') {
      $reset.classList.add('hidden');
    }
  }

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

  function handleDuplicateCheckListener(e) {
    e.preventDefault();
    
    const $nickname = document.querySelector('.input-container.nickname');
    const $password = document.querySelector('.input-container.password');
    const $birth = document.querySelector('.input-container.birth');

    const $inputContainer = e.target.closest('.input-container');
    const $emailInput = $inputContainer.querySelector('input#email');
    const $emailValidation = document.querySelector('.email-validation');

    const { value } = $emailInput;

    if (value === '' || value === null) {
        alert('이메일을 입력해주세요');
        toggleCheck(this, false);
        emailCheck = false;
    } else {
        $emailValidation.classList.remove('hidden');
        toggleCheck(this, true);
        emailCheck = true;
        checkAllInfoFilled();

        $nickname.classList.remove('hidden');
        $password.classList.remove('hidden');
        $birth.classList.remove('hidden');
    }
    
  }

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
      }
    }
    checkAllInfoFilled();
    if (value.length === 4) {
      // 2000.
      this.value = value + '.';
    } else if (value.length === 7) {
      // 2000.05.
      this.value = value + '.';
    }
  }

  const $emailInput = document.querySelector('input#email');
  const $nicknameInput = document.querySelector('input#nickname');
  const $passwordInput = document.querySelector('input#password');
  const $birthInput = document.querySelector('input#birth');
  const $duplicateCheckBtn = document.querySelector('.duplicate-check');
  const $signUpBtn = document.querySelector('.next-btn');

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
