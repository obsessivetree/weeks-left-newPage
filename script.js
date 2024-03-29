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
const lifeGrid = createEl("div", (id = "life-grid"));
const birthYearInput = document.querySelector("input");
const weeksUntilNextDecadeAgeSpan = document.querySelector(
  "#weeks-until-next-decade-age"
);
const nextDecadeAgeSpan = document.querySelector("#next-decade-age");
const weeksLeftThisYearSpan = document.querySelector("#weeks-left-this-year");

const expectedLifeSpanWeeks = 83 * 52;

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
  for (let j = 0; j < expectedLifeSpanWeeks; j++) {
    const weekBox = createEl("div", (clss = "week-box"));
    lifeDiv.appendChild(weekBox);
  }
};

const fillElapsedWeeks = (ageInWeeks = 10) => {
  const thisYearElapsedWeeks = ageInWeeks % 52;
  for (let i = 0; i < ageInWeeks - thisYearElapsedWeeks; i++) {
    lifeDiv.childNodes[i].classList = "week-box lived";
  }
  for (let i = ageInWeeks - thisYearElapsedWeeks; i < ageInWeeks; i++) {
    lifeDiv.childNodes[i].classList = "week-box lived-this-year";
  }
  document.querySelector("#weeks-left").textContent = `${
    expectedLifeSpanWeeks - ageInWeeks
  }`;
};
const updateUI = () => {
  const dateNow = new Date();
  birthYearInput.remove();
  generateWeekDivs();
  const birthYear = getBirthYear();
  const elapsedWeeks = getElapsedWeeks(birthYear);
  fillElapsedWeeks(elapsedWeeks);
  weeksLeftThisYearSpan.textContent = String(52 - getWeekOfTheYear(dateNow));
  // nextDecadeAgeSpan.textContent = String(dateNow.getFullYear() - birthYear);
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
