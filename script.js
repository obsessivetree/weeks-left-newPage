const expectedLifeSpanYears = 85;
function createEl(type, clss = "", id = "") {
  const el = document.createElement(type);
  if (clss !== "") {
    el.classList.add(clss);
  }
  if (id !== "") {
    el.id = id;
  }
  return el;
}

const body = document.querySelector("body");
const lifeDiv = document.querySelector("#life");
// const lifeGrid = createEl("div", (id = "life-grid"));
const birthYearInput = document.querySelector("input");
const weeksUntilNextDecadeAgeSpan = document.querySelector(
  "#weeks-until-next-decade-age"
);
const nextDecadeAgeSpan = document.querySelector("#next-decade-age");
const weeksLeftThisYearSpan = document.querySelector("#weeks-left-this-year");
const weeksLeft = document.querySelector("#weeks-left");
const expectedLifeSpanWeeks = expectedLifeSpanYears * 52; // 4316

const getBirthYear = () => {
  let birthYear = 1966;
  if (localStorage.getItem("user-birthday")) {
    birthYear = localStorage.getItem("user-birthday");
  }
  return birthYear;
};
function getWeekOfTheYear(date) {
  return Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24 / 7
  );
}
const getElapsedWeeks = (birthYear = 1996) => {
  const dateNow = new Date();
  const elapsedWeeks =
    getWeekOfTheYear(dateNow) + (dateNow.getFullYear() - birthYear) * 52;
  // console.log(elapsedWeeks);
  return elapsedWeeks;
};

const generateWeekDivs = () => {
  const maxDecades = Math.floor(expectedLifeSpanWeeks / 520);
  for (let i = 0; i <= maxDecades; i++) {
    const decadeDiv = createEl("div", "decade");
    if (i % 2 === 0) {
      decadeDiv.classList.add("decade-shader");
    }
    lifeDiv.appendChild(decadeDiv);
    const weeks = i === maxDecades ? expectedLifeSpanWeeks % 520 : 520;
    if (weeks === 520) {
      const decadeNumber = createEl("div", "decade-number");
      decadeNumber.textContent = i * 10;
      decadeDiv.appendChild(decadeNumber);
    }
    for (let j = 0; j < weeks; j++) {
      const weekBox = createEl("div", (clss = "week-box"));
      if (j === 0 && i === 0) {
        weekBox.classList.add("top-left");
      }
      if (j === 51 && i === 0) {
        weekBox.classList.add("top-right");
      }
      if (j === weeks - 1 && i === maxDecades) {
        weekBox.classList.add("bottom-right");
      }
      if (j === weeks - 52 && i === maxDecades) {
        weekBox.classList.add("bottom-left");
      }
      decadeDiv.appendChild(weekBox);
    }
  }
};

const fillElapsedWeeks = (ageInWeeks = 10) => {
  const thisYearElapsedWeeks = ageInWeeks % 52;
  const weekDivs = lifeDiv.querySelectorAll(".week-box");
  for (let i = 0; i < ageInWeeks - thisYearElapsedWeeks; i++) {
    weekDivs[i].classList.add("lived");
    if (i % 520 === 0) {
      weekDivs[i].parentElement
        .querySelector(".decade-number")
        .classList.add("decade-lived");
    }
  }
  for (let i = ageInWeeks - thisYearElapsedWeeks; i < ageInWeeks; i++) {
    weekDivs[i].classList.add("lived-this-year");
    weekDivs[i].parentElement
      .querySelector(".decade-number")
      .classList.add("current-decade");
    weekDivs[i].parentElement
      .querySelector(".decade-number")
      .classList.remove("decade-lived");
  }
  weeksLeft.textContent = `${expectedLifeSpanWeeks - ageInWeeks}`;
};
const updateUI = () => {
  const dateNow = new Date();
  birthYearInput.remove();
  generateWeekDivs();
  const birthYear = getBirthYear();
  const elapsedWeeks = getElapsedWeeks(birthYear);
  fillElapsedWeeks(elapsedWeeks);
  weeksLeftThisYearSpan.textContent = String(52 - getWeekOfTheYear(dateNow));
  nextDecadeAgeSpan.textContent = String(dateNow.getFullYear() - birthYear);
  (() => {
    const age = dateNow.getFullYear() - birthYear;
    for (let i = 10; 10 < 110; i += 10) {
      if (i > age) {
        weeksUntilNextDecadeAgeSpan.textContent = (i - age) * 52;
        nextDecadeAgeSpan.textContent = i;
        return;
      }
    }
  })();
};
const run = () => {
  if (localStorage.getItem("user-birthday")) {
    updateUI();
  } else {
    birthYearInput.addEventListener("input", () => {
      if (birthYearInput.value.length === 4) {
        localStorage.setItem("user-birthday", birthYearInput.value);
        updateUI();
      }
    });
  }
};

run();

const flashableEls = [
  document.querySelector("h1"),
  // nextDecadeAgeSpan,
  // weeksLeftThisYearSpan,
  // weeksUntilNextDecadeAgeSpan,
  // weeksLeft,
];

flashableEls.forEach((el) => {
  let interval = 400;
  let timer = interval;
  const length = 3000;
  let startTime = null;

  function flash(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < length && elapsed > timer) {
      el.classList.toggle("flash");
      timer += interval;
      interval = interval * 0.8;
    }
    if (elapsed > length) {
      el.classList.remove("flash");
    }
    requestAnimationFrame(flash);
  }

  requestAnimationFrame(flash);
});
