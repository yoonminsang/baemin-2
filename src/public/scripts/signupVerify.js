(function() {
    let isPhoneNumberFull = false;
    let isVerifyNumberFull = false;

    function checkAllInfoFilled() {
        const nextBtn = document.querySelector('a.next-btn');

        if (isPhoneNumberFull === true && isVerifyNumberFull === true) {
            nextBtn.classList.remove('inactive');
        } else {
            if (nextBtn.classList.contains('inactive') === false) {// 활성화 상태인경우, 비활성화
                nextBtn.classList.add('inactive');
            }
        }
    }

    function handleRemoveClickListener(e) {
        const $input = document.querySelector('input#phone');
    
        $input.value = '';
        $input.focus();
    }
    
    function handleFullNumberListener(e) {
        const { maxLength, value } = e.target;
        const img = document.querySelector('.phone-number-validation img');
        const icon = img.src.split('/')[2];
        
        if (maxLength === value.length) {
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
        checkAllInfoFilled();
    }
    
    function handleKeyupListener(e) {
        if (e.key === 'Delete' || e.key === 'Backspace')
            return ;

        const { value } = e.target;
    
        if (value.length === 3) { // 010-
            this.value = value + '-';
        } else if (value.length === 8) { // 010-1234-
            this.value = value + '-';
        }
    }
    
    function getNumDigit(num) {
        const min = Math.pow(10, num - 1);
        return Math.floor(min + Math.random() * (Math.pow(10, num) - min));
    }

    function fillVerifyNumber() {
        const $verifyInput = document.querySelector('.verify.input-container input');

        setTimeout(function() {
            $verifyInput.value = getNumDigit(4);
            $verifyInput.focus();
            isVerifyNumberFull = true;
            checkAllInfoFilled();
        }, 2000)
    }
    
    function handleVerifyClickListener(e) {
        const $verifyBtn = document.querySelector('.verify-number-btn');
        const $verifyInputContainer = document.querySelector('.verify.input-container');

        $verifyBtn.classList.remove('show');
        $verifyBtn.classList.add('hidden');

        $verifyInputContainer.classList.remove('hidden');
        $verifyInputContainer.classList.add('show');
        
        fillVerifyNumber();
    }

    function handleVerifyInputListener(e) {
        const { value } = e.target;

        if (value.length === 4) {
            isVerifyNumberFull = true;
        } else {
            isVerifyNumberFull = false;
        }
        checkAllInfoFilled();
    }

    const $verifyBtn = document.querySelector('.verify-number-btn');
    const $phoneInput = document.querySelector('input#phone');
    const $resetBtn = document.querySelector('.reset-phone-number');
    const $verifyAgainBtn = document.querySelector('.verify-number-again-btn');
    const $verifyInput = document.querySelector('#verify-number');

    $verifyBtn.addEventListener('click', handleVerifyClickListener);
    $phoneInput.addEventListener('keyup', handleKeyupListener);
    $phoneInput.addEventListener('keyup', handleFullNumberListener);
    $resetBtn.addEventListener('click', handleRemoveClickListener);
    $verifyAgainBtn.addEventListener('click', fillVerifyNumber);
    $verifyInput.addEventListener('input', handleVerifyInputListener);
})();