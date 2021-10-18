class Timer {
  constructor({ selector, targetDate }) {
    this.date = targetDate;
    this.timerSelector = selector;
  }

  #intervalId = null;

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
      this.stopTimer();
      alert('Time is come');
      return;
    }
    const timerUnits = this.getTimerUnits(time);
    this.renderTimer(refs, timerUnits);
  }

  start() {
    if (this.getTimerTime() <= 0) {
      console.log('Time is come');
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
}

const timer = new Timer({
  selector: '#timer-2',
  targetDate: new Date('Oct 25 2021 22:10'),
});

timer.start();
