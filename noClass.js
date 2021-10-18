const refs = {
  daysSpan: document.querySelector('#timer-2 span[data-value="days"]'),
  hoursSpan: document.querySelector('#timer-2 span[data-value="hours"]'),
  minsSpan: document.querySelector('#timer-2 span[data-value="mins"]'),
  secsSpan: document.querySelector('#timer-2 span[data-value="secs"]'),
};

const date = new Date('Nov 1, 2021');

const getTimerTime = date => date.getTime() - Date.now();

const padStartSrt = number => String(number).padStart(2, 0);

const getTimerUnits = time => {
  const days = padStartSrt(Math.floor(time / (1000 * 60 * 60 * 24)));
  const hours = padStartSrt(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const mins = padStartSrt(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
  const secs = padStartSrt(Math.floor((time % (1000 * 60)) / 1000));

  return { days, hours, mins, secs };
};

const renderTimer = timerUnits => {
  const { days, hours, mins, secs } = timerUnits;

  refs.daysSpan.textContent = days;
  refs.hoursSpan.textContent = hours;
  refs.minsSpan.textContent = mins;
  refs.secsSpan.textContent = secs;
};

const getTimer = date => {
  const time = getTimerTime(date);
  const timerUnits = getTimerUnits(time);
  renderTimer(timerUnits);
};

getTimer(date);
setInterval(getTimer, 1000, date);
