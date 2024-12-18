const expectedLifeSpanYears = 85;
function createEl(type, clss = "", id = "") {
  const el = document.createElement(type);
  if (clss !== "") {
    clss.split(" ").forEach((c) => {
      if (c !== "") {
        el.classList.add(c);
      }
    });
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
let birthWeek;
const getBirthYear = () => {
  let birthYear;
  if (localStorage.getItem("user-birthday")) {
    const bday = localStorage.getItem("user-birthday");
    birthYear = bday.slice(0, 4);
    birthWeek = getWeekOfTheYear(new Date(bday));
    // console.log(birthWeek);
  }
  return { birthYear, birthWeek };
};
async function getCountries() {
  const response = await fetch(
    "https://api.worldbank.org/v2/country?format=json&per_page=300"
  );
  const data = await response.json().then((data) => {
    console.log(data);
  });
  return data;
}
async function getLifeExpectancy(countryCode = "US") {
  const response = await fetch(
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.DYN.LE00.IN?format=json&date=${
      new Date().getFullYear() - 8
    }:${new Date().getFullYear()}`
  );
  await response
    .json()
    .then((data) => {
      if (data[1]) {
        data[1].some((obj) => {
          if (obj.value) {
            console.log(obj.value, obj.date);
            return Math.ceil(obj.value);
          }
        });
        console.log(data[1]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAge() {
  const birthDate = new Date(localStorage.getItem("user-birthday"));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if the birthdate hasn't occurred yet this year
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  // console.log(age);
  return {
    inDays: age * 365,
    inWeeks: age * 52,
    inYears: age,
    birthWeek: getWeekOfTheYear(birthDate),
  };
}
const age = getAge();

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
      i === 0 ? null : (decadeNumber.textContent = i * 10);

      decadeDiv.appendChild(decadeNumber);
    }
    for (let j = 0; j < weeks; j++) {
      const decadeNumberString = `${i}${Math.floor(j / 52)}`;
      const weekNumber = j % 52;
      const id = `${decadeNumberString}-${
        weekNumber < 10 ? 0 : ""
      }${weekNumber}`;

      const weekBox = createEl(
        "div",
        (clss = `week-box ${age.birthWeek === weekNumber ? "birth-week" : ""}`),
        id
      );
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
  const birthMonth = new Date(localStorage.getItem("user-birthday")).getMonth();
  if (birthMonth > 5 && birthMonth < 7) {
    console.log(birthMonth);
    document.querySelectorAll(".decade-number").forEach((el) => {
      el.style.transform = "translate(0%, -50%)";
      el.style.left = "0%";
    });
  }
};

const fillElapsedWeeks = (ageInWeeks) => {
  const thisYearElapsedWeeks = ageInWeeks % 52;
  const weekDivs = lifeDiv.querySelectorAll(".week-box");
  for (let i = 0; i < ageInWeeks - thisYearElapsedWeeks; i++) {
    if (Number(weekDivs[i].id.slice(0, 2)) > 13) {
      weekDivs[i].classList.add("lived");
    } else {
      weekDivs[i].classList.add("unconciously-lived");
    }
    if (i % 520 === 0) {
      weekDivs[i].parentElement
        .querySelector(".decade-number")
        .classList.add("decade-lived");
    }
    if (weekDivs[i].classList.contains("birth-week")) {
      weekDivs[i].classList.remove("birth-week");
    }
  }
  for (let i = ageInWeeks - thisYearElapsedWeeks; i < ageInWeeks; i++) {
    weekDivs[i].classList.add("lived-this-year");
    const decadeNumberDiv =
      weekDivs[i].parentElement.querySelector(".decade-number");
    decadeNumberDiv.classList.add("current-decade");
    decadeNumberDiv.textContent = age.inYears;
    weekDivs[i].parentElement
      .querySelector(".decade-number")
      .classList.remove("decade-lived");
  }
  weeksLeft.textContent = `${expectedLifeSpanWeeks - ageInWeeks}`;
};
const updateUI = () => {
  const dateNow = new Date();
  document.querySelector("form").remove();
  document.querySelector("#header-content").classList.remove("invisible");
  generateWeekDivs();
  const bday = localStorage.getItem("user-birthday");
  const birthYear = getBirthYear().birthYear;
  const elapsedWeeks = getElapsedWeeks(birthYear);
  fillElapsedWeeks(elapsedWeeks);
  weeksLeftThisYearSpan.textContent = String(52 - getWeekOfTheYear(dateNow));
  // nextDecadeAgeSpan.textContent = String(dateNow.getFullYear() - birthYear);
  const nowDate = new Date(dateNow);
  const bdayDate = new Date(bday);
  const weeksTiillNextDecade = nowDate - bdayDate;
  nextDecadeAgeSpan.textContent = weeksTiillNextDecade;

  (() => {
    const age = dateNow.getFullYear() - birthYear;

    for (let i = 10; i < 110; i += 10) {
      if (i > age) {
        weeksUntilNextDecadeAgeSpan.textContent =
          (i - age) * 52 + (52 - birthWeek);
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
    document
      .querySelector('button[type="submit"]')
      .addEventListener("click", (e) => {
        const birthday =
          e.target.parentElement.querySelector("#birthyear").value;
        const sex = e.target.parentElement.querySelector(
          "input[name=sex]:checked"
        ).value;
        const country = e.target.parentElement.querySelector("#country").value;
        console.log(birthday, sex, country);
        console.log(document.querySelector("input").autocomplete);
        const match = birthday.match(/\d{4}-\d{2}-\d{2}/);
        if (match === null || match[0] !== birthday) {
          alert("Please enter a valid date in the format YYYY-MM-DD");
          return;
        }
        localStorage.setItem("user-birthday", birthday);
        updateUI();

        // localStorage.setItem("user-birthday", birthYearInput.value);
        // updateUI();
      });
  }
};

run();

const flashableEls = [
  document.querySelector("h1"),
  nextDecadeAgeSpan,
  weeksLeftThisYearSpan,
  weeksUntilNextDecadeAgeSpan,
  weeksLeft,
];

flashableEls.forEach((el) => {
  let interval = 200;
  let timer = interval;
  const length = 1000;
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
