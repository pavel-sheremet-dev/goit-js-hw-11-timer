class CountdownTimer {
  constructor({ selector, targetDate }) {
    this.date = targetDate;
    this.timerSelector = selector;
  }

  #intervalId = null;

  getLocaleTime() {
    return `${timer.date.toLocaleDateString()} ${timer.date.toLocaleTimeString()}`;
  }

  logs() {
    return {
      noContainer: `html markup has no div container with ${
        this.timerSelector
      }. In this case was created new container as first element of body. Or you can add next stroke into your html document: <div class="timer" id="${this.getNormalizedId()}">
      `,
      invalidTime: `${this.date} format. In this case was timer reset to 00:00:00:00 (Use current time). Please check what is the value in targetDate or use method newDate() with parametr like 'Month DD YYYY HH:MM'
      `,
      timeLeft: `targetDate ${this.getLocaleTime()} < Current time. So please change Date to start Timer. Use method newDate() with parametr like 'Month DD YYYY HH:MM'
      `,
      timeIsCome: `The time ${this.getLocaleTime()} is come`,
    };
  }

  getContainerMarkUp() {
    const normalizedId = this.getNormalizedId();
    const newContainer = `<div class="timer" id="${normalizedId}">`;
    return newContainer;
  }

  getTimerMarkup() {
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

  getTimerMarkupWithContainer() {
    const newContainer = this.getContainerMarkUp();
    const timerMarkUp = this.getTimerMarkup();
    document.body.insertAdjacentHTML('afterbegin', `${newContainer} ${timerMarkUp}`);
  }

  getNormalizedId() {
    return this.timerSelector.replace('#', '');
  }

  renderTimerMarkup() {
    const timerContainer = document.querySelector(`${this.timerSelector}`);

    if (!timerContainer) {
      this.getTimerMarkupWithContainer();

      console.warn(this.logs().noContainer);
      return;
    }

    const timerMarkUp = this.getTimerMarkup();
    timerContainer.innerHTML = timerMarkUp;
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
      console.log(this.logs().timeIsCome);
      this.stopTimer();
      alert(this.logs().timeIsCome);
      return;
    }
    const timerUnits = this.getTimerUnits(time);
    this.renderTimer(refs, timerUnits);
  }

  start() {
    this.renderTimerMarkup();

    if (!this.date.getTime()) {
      console.warn(this.logs().invalidTime);
      return;
    }

    if (this.getTimerTime() <= 0) {
      console.warn(this.logs().timeLeft);
      return;
    }
    this.getTimer();
    this.#intervalId = setInterval(this.getTimer.bind(this), 1000);
  }

  stopTimer() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  newDate(time) {
    console.clear();
    this.stopTimer();
    this.date = new Date(time);
    this.start();
  }
}

// Класс CountdownTimer генерит разметку сам.

// Таймер не будет крашиться:
// 1. Если при создании екземпляра указать id, которого нет в разметке.
// 2. Если в разметке не добавить контейнер вообще
// 3. Если при создании екземпляра прийдёт время меньше текущего.
// 4. Если прийдёт время в неправильном формате.

// Для интереса добавил логи, которые указывают на ошибку

const timer = new CountdownTimer({
  selector: '#timer-1',
  targetDate: new Date('Oct 25 2021 20:50'),
});

timer.start();

// timer.newDate('Dec 12 2021 15:00');
// timer.newDate('Dec 12 2020 15:00');
// timer.start();

const timerTitle = document.querySelector('.timer-head');
timerTitle.textContent = `${timer.getLocaleTime()} ${
  timer.getTimerTime() > 0 ? 'will come in:' : 'has already passed'
} `;
