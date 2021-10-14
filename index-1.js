class CountdownTimer {
  constructor({ selector, targetDate }) {
    this.date = targetDate;
    this.timerSelector = selector;
  }

  #intervalId = null;

  #getTimerMarkup() {
    return `
    <div class="field">
      <span class="value" data-value="days">00</span>
      <span class="label">Days</span>
    </div>
    <div class="field">
      <span class="value" data-value="hours">00</span>
      <span class="label">Hours</span>
    </div>
    <div class="field">
      <span class="value" data-value="mins">00</span>
      <span class="label">Minutes</span>
    </div>
    <div class="field">
      <span class="value" data-value="secs">00</span>
      <span class="label">Seconds</span>
    </div>`;
  }

  #getContainerMarkUp() {
    const normalizedId = this.timerSelector.replace('#', '');
    const newContainer = `<div class="timer" id="${normalizedId}">`;
    return newContainer;
  }

  #getTimerMarkupWithIncorectSelector() {
    const newContainer = this.#getContainerMarkUp();
    const timerMarkUp = this.#getTimerMarkup();
    document.body.insertAdjacentHTML('beforeend', `${newContainer} ${timerMarkUp}`);
  }

  renderTimerMarkup() {
    const timerMarkUp = this.#getTimerMarkup();
    const timerContainer = document.querySelector(`${this.timerSelector}`);
    if (!timerContainer) {
      this.#getTimerMarkupWithIncorectSelector();
      return;
    }
    timerContainer.insertAdjacentHTML('afterbegin', timerMarkUp);
  }

  getRefs() {
    const refs = {
      daysSpan: document.querySelector(`${this.timerSelector} span[data-value="days"]`),
      hoursSpan: document.querySelector(`${this.timerSelector} span[data-value="hours"]`),
      minsSpan: document.querySelector(`${this.timerSelector} span[data-value="mins"]`),
      secsSpan: document.querySelector(`${this.timerSelector} span[data-value="secs"]`),
    };
    return refs;
  }

  getTimerTime() {
    if (!this.date.getTime()) {
      console.log('Invalid targetDate');
      this.date = new Date();
    }
    return this.date.getTime() - Date.now();
  }

  padStartSrt(number) {
    return String(number).padStart(2, 0);
  }

  getTimerUnits(time) {
    const days = this.padStartSrt(Math.floor(time / (1000 * 60 * 60 * 24)));
    const hours = this.padStartSrt(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = this.padStartSrt(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.padStartSrt(Math.floor((time % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }

  renderTimer(refs, timerUnits) {
    const { days, hours, mins, secs } = timerUnits;
    const { daysSpan, hoursSpan, minsSpan, secsSpan } = refs;
    daysSpan.textContent = days;
    hoursSpan.textContent = hours;
    minsSpan.textContent = mins;
    secsSpan.textContent = secs;
  }

  getTimer() {
    const time = this.getTimerTime();
    const refs = this.getRefs();
    if (time < 0) {
      console.log('time is left');
      clearInterval(this.#intervalId);
      this.#intervalId = null;
      alert('TIME IS LEFT');
      return;
    }
    const timerUnits = this.getTimerUnits(time);
    this.renderTimer(refs, timerUnits);
  }

  startTimer() {
    this.renderTimerMarkup();
    if (this.getTimerTime() <= 0) {
      console.log('Datetime <= current time or Invalid targetDate');
      return;
    }
    this.getTimer();
    this.#intervalId = setInterval(this.getTimer.bind(this), 1000);
  }
}

const timer = new CountdownTimer({
  selector: '#timer-1',
  targetDate: new Date('Dec 01 2021 00:00'),
});

timer.startTimer();

const timerTitle = document.querySelector('.timer-head');
timerTitle.textContent = `${timer.date.toLocaleDateString()} ${timer.date.toLocaleTimeString()} will come in:`;
