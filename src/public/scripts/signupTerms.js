const ALLCHECK = 'allCheck';
const CHECK = 'check';
const AGECHECK = 'ageCheck';
const NEXT = 'next';

function AllCheck({ initialState, check }) {
  const $agreeAll = document.querySelector('.agree-all');
  const $allCheck = $agreeAll.querySelector('.inp-check');
  const $allCheckLab = $agreeAll.querySelector('.lab-check');
  this.state = initialState;
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };
  this.render = () => {
    if (this.state) {
      $allCheckLab.classList.replace('off', 'on');
    } else {
      $allCheckLab.classList.replace('on', 'off');
    }
  };
  $allCheck.addEventListener('click', check);
}

function Check({ initialState, check }) {
  const $agreeContainer = document.querySelector('.agree-container');
  const $checkLabArr = [...$agreeContainer.querySelectorAll('.lab-check')];
  this.state = initialState;
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };
  this.render = () => {
    this.state.forEach((v, i) => {
      if (v) {
        $checkLabArr[i].classList.replace('off', 'on');
      } else {
        $checkLabArr[i].classList.replace('on', 'off');
      }
    });
  };
  $agreeContainer.addEventListener('click', check);
}

function AgeCheck({ initialState, check }) {
  const $ageSelect = document.querySelector('.age-select');
  const $checkLabArr = [...$ageSelect.querySelectorAll('.lab-age-check')];
  this.state = initialState;
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };
  this.render = () => {
    $checkLabArr.forEach((v, i) => {
      if (this.state == i) {
        v.classList.replace('off', 'on');
      } else {
        v.classList.replace('on', 'off');
      }
    });
  };
  $ageSelect.addEventListener('click', check);
}

function Next({ initialState, check }) {
  const $footer = document.querySelector('.footer');
  const $btn = $footer.querySelector('.btn1');
  this.state = initialState;
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };
  this.render = () => {
    if (this.state.checkComplete && this.state.ageComplete) {
      $btn.classList.remove('disabled');
    } else {
      $btn.classList.add('disabled');
    }
  };
  $btn.addEventListener('click', check);
}

function App() {
  this.state = {
    allCheck: false,
    checkArr: Array(5).fill(false),
    checkComplete: false,
    ageCheck: null,
    ageComplete: false,
  };
  const allCheck = new AllCheck({
    initialState: this.state.allCheck,
    check: ({ target }) => {
      const nextCheck = !this.state.allCheck;
      this.setState(ALLCHECK, {
        ...this.state,
        allCheck: nextCheck,
        // allCheck: target.checked,
      });
      this.setState(CHECK, {
        ...this.state,
        checkArr: Array(5).fill(nextCheck),
        // checkArr: Array(5).fill(target.checked),
      });
      this.setState(NEXT, {
        ...this.state,
        checkComplete: nextCheck,
      });
    },
  });
  const check = new Check({
    initialState: this.state.checkArr,
    check: ({ target }) => {
      if (target.classList.value !== 'inp-check') return;
      const checkArr = this.state.checkArr.slice();
      const idx = target.id.slice(-1) - 1;
      checkArr[idx] = !checkArr[idx];
      //   checkArr[idx] = target.checked;
      this.setState(CHECK, {
        ...this.state,
        checkArr: checkArr,
      });
      const acc = this.state.checkArr.reduce(
        (acc, cur) => (cur ? acc + 1 : acc),
        0,
      );
      if (acc === 5) {
        this.setState(ALLCHECK, { ...this.state, allCheck: true });
      } else {
        this.setState(ALLCHECK, { ...this.state, allCheck: false });
      }
      const completeAcc = this.state.checkArr
        .slice(0, 3)
        .reduce((acc, cur) => (cur ? acc + 1 : acc), 0);
      if (completeAcc === 3) {
        this.setState(NEXT, {
          ...this.state,
          checkComplete: true,
        });
      } else {
        this.setState(NEXT, {
          ...this.state,
          checkComplete: false,
        });
      }
    },
  });
  const ageCheck = new AgeCheck({
    initialState: this.state.ageCheck,
    check: ({ target }) => {
      if (target.classList.value !== 'inp-check') return;
      const idx = target.id.slice(-1) - 1;
      this.setState(AGECHECK, {
        ...this.state,
        ageCheck: idx,
      });
      this.setState(NEXT, {
        ...this.state,
        ageComplete: true,
      });
    },
  });
  const next = new Next({
    initialState: {
      checkComplete: this.state.checkComplete,
      ageComplete: this.state.ageComplete,
    },
    check: () => {
      location.href = '/auth/signup/verify';
    },
  });
  this.setState = (type, nextState) => {
    // console.log(this.state, nextState);
    this.state = nextState;
    switch (type) {
      case ALLCHECK:
        return allCheck.setState(this.state.allCheck);
      case CHECK:
        return check.setState(this.state.checkArr);
      case AGECHECK:
        return ageCheck.setState(this.state.ageCheck);
      case NEXT:
        return next.setState({
          checkComplete: this.state.checkComplete,
          ageComplete: this.state.ageComplete,
        });
    }
  };
}
new App();
