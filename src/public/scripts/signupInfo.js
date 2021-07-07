/**
 * 이메일 입력 후 중복확인 버튼 누르면 v 체크 완료표시 뜬다. 포커스 시에는 x 버튼이 뜬다.
 * x 누르면 해당 인풋 내용삭제(함수 재사용)
 * 체크 표시 뜬후에는 닉네임, 비밀번호, 생년월일 ui 노출
 * 
 * 닉네임도 마찬가지로 체크표시뜬다.
 * 
 * 비밀번호 규칙은 length >= 10, 대문자, 소문자, 숫자, 특수 문자 중 2종류 조합
 * 같은숫자 3개연속 혹은 increment, decrement 숫자 연속 3개 불가능.
 * 오류노출
 * 
 * 생년월일 입력시 자동으로 . 붙인다.
 * 올바르지 않으면 오류 노출.
 * 
 * 모두 정상 입력시. 완료 표시 활성화. 누르면 메인으로.
 */

// 모든 인풋에 대한 리스너. 포커스 할 시에 지우기 버튼 활성화
(function() {
    let emailCheck = false;
    let nicknameCheck = false;
    let passwordCheck = false;
    let birthCheck = false;

    function toggleCheck($this, isPassed) {
        const $inputContainer = $this.closest('.input-container');
        const $img = $inputContainer.querySelector('.validation img');
        const icon = $img.src.split('/')[2];

        if (isPassed) {
            if (icon.startsWith('검증_T') === false) {
                img.src = '/image/검증_T.png';
                isPhoneNumberFull = true;
            }
        } else {
            if (icon.startsWith("검증_F") === false) {
                img.src = "/image/검증_F.png"
                isPhoneNumberFull = false;
            }
        }
    }

    function handleInputFocusListener(e) {
        // x 표시
        // 미표시
        // focusin, blur 모두에 달아줌
        const $inputContainer = e.target.closest('.input-container');
        const $reset = $inputContainer.querySelector('.reset');
        if ($reset.classList.contains('hidden') === true) {
            $reset.classList.remove('hidden')
        } else {
            $reset.classList.add('hidden');
        }
    }

    function handleNickNameInputListener(e) {
        const { value } = e.target;
        if (value === '' || value === null) {
            toggleCheck(this, false);
        } else {
            toggleCheck(this, true);
        }
    }

    function handleDuplicateCheckListener() {
        const $nickname = '';
        const $password = '';
        const $birth = '';

        const { value } = e.target;
        if (value === '' || value === null) {
            toggleCheck(this, false);
        } else {
            toggleCheck(this, true);
        }
        $nickname.classList.remove('hidden');
        $password.classList.remove('hidden');
        $birth.classList.remove('hidden');
    }

    function checkNoCotinuousNumber(password) {
        const sameNumberCondition = ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'];
        const continuousCondition = ['012', '123', '234',  '345', '456', '567', '678', '789'];

        function strReverse(str) {
            return str.split('').reverse().join('');
        }

        const resultSameNumber = sameNumberCondition.every(value => password.indexOf(value) === -1);
        if (resultSameNumber === false) return false;

        const resultContinuous = continuousCondition.every(value => password.indexOf(value) === -1 && password.indexOf(strReverse(str)) === -1)
        if (resultContinuous === false) return false;

        return true;
    }

    function checkAtLeastTwoTypesExist(password) {
        const types = {
            upper: 0,
            lower: 0,
            num: 0,
            special: 0
        }

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

        password.forEach(char => {
            characterFilter(char);
        });
        const typeCount = Object.values(types).reduce((total, exist) => total + exist, 0);
        
        return typeCount >= 2;
    }

    function passwordValidationCheck(password) {
        if (password.length < 10) return false;
        if (checkAtLeastTwoTypesExist(password) === false) return false;
        if (checkNoCotinuousNumber(password) === false) return false;

        return true;
    }

    function handlePasswordInputListener(e) {
        const { value: password } = e.target;
        const $error = '';

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
    }

    function handleBirthInputListener(e) {
        if (e.key === 'Delete' || e.key === 'Backspace')
            return ;

        const $error = '';
        const { value } = e.target;
        
        if (value.length < 12) {
            $error.classList.remove('.hidden');
            toggleCheck(this, false);
        } else {
            $error.classList.add('.hidden');
            toggleCheck(this, true);
        }

        if (value.length === 4) { // 2000.
            this.value = value + '.';
        } else if (value.length === 6) { // 2000.05.
            this.value = value + '.';
        }
    }

})();