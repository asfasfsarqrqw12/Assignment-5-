// Task 3: Character creator
const TOTAL_SKILL_POINTS = 20;
const SKILL_IDS = ["strength", "magic", "agility", "defense"];
const takenNames = ["Aria", "Rex", "Nova"];

const form = document.querySelector("#characterForm");
const nameInput = document.querySelector("#characterName");
const classInput = document.querySelector("#characterClass");
const colorInput = document.querySelector("#characterColor");

const pointsUsed = document.querySelector("#pointsUsed");
const pointsLeft = document.querySelector("#pointsLeft");
const formSummary = document.querySelector("#formSummary");
const preview = document.querySelector("#characterPreview");
const createdResult = document.querySelector("#createdResult");

function skillValues() {
  const values = {};

  SKILL_IDS.forEach((id) => {
    values[id] = Number(document.querySelector("#" + id).value);
  });

  return values;
}

function totalPoints(values) {
  let total = 0;

  for (const id of SKILL_IDS) {
    total += values[id];
  }

  return total;
}

function getFieldError(id) {
  const element = document.querySelector("#" + id);
  const value = element.value.trim();

  if (id === "characterName") {
    if (value.length < 3 || value.length > 16) {
      return "Name must contain 3–16 characters.";
    }

    if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(value)) {
      return "Use English letters, numbers or spaces; start with a letter.";
    }

    if (takenNames.some(
      (name) => name.toLowerCase() === value.toLowerCase()
    )) {
      return "This name is already taken.";
    }
  }

  if (id === "characterClass" && value === "") {
    return "Choose a class.";
  }

  if (id === "characterColor" && value === "") {
    return "Choose a color.";
  }

  if (SKILL_IDS.includes(id)) {
    const number = Number(value);

    if (
      value === "" ||
      !Number.isInteger(number) ||
      number < 1 ||
      number > 10
    ) {
      return "Enter a whole number from 1 to 10.";
    }
  }

  return "";
}

function validateField(id) {
  const element = document.querySelector("#" + id);
  const errorElement = document.querySelector("#" + id + "Error");
  const error = getFieldError(id);

  errorElement.textContent = error;
  element.setAttribute("aria-invalid", error ? "true" : "false");

  return error;
}

function validateAll() {
  const ids = [
    "characterName",
    "characterClass",
    "characterColor",
    ...SKILL_IDS
  ];

  const errors = [];

  ids.forEach((id) => {
    const error = validateField(id);

    if (error) {
      errors.push({ id, message: error });
    }
  });

  const values = skillValues();

  const skillsAreValid = SKILL_IDS.every(
    (id) => !getFieldError(id)
  );

  if (
    skillsAreValid &&
    totalPoints(values) !== TOTAL_SKILL_POINTS
  ) {
    errors.push({
      id: "strength",
      message: "All four skills must add up to exactly 20 points."
    });

    document.querySelector("#strengthError").textContent =
      "All four skills must add up to exactly 20 points.";

    document.querySelector("#strength").setAttribute(
      "aria-invalid",
      "true"
    );
  }

  if (
    classInput.value === "Mage" &&
    values.magic < 5 &&
    !getFieldError("magic")
  ) {
    errors.push({
      id: "magic",
      message: "A Mage needs at least 5 Magic points."
    });

    document.querySelector("#magicError").textContent =
      "A Mage needs at least 5 Magic points.";

    document.querySelector("#magic").setAttribute(
      "aria-invalid",
      "true"
    );
  }

  if (
    classInput.value === "Warrior" &&
    values.strength < 5 &&
    !getFieldError("strength")
  ) {
    errors.push({
      id: "strength",
      message: "A Warrior needs at least 5 Strength points."
    });

    document.querySelector("#strengthError").textContent =
      "A Warrior needs at least 5 Strength points.";

    document.querySelector("#strength").setAttribute(
      "aria-invalid",
      "true"
    );
  }

  return errors;
}

function updatePreview() {
  const values = skillValues();
  const total = totalPoints(values);

  document.querySelector("#previewName").textContent =
    nameInput.value.trim() || "Your character";

  document.querySelector("#previewClass").textContent =
    "Class: " + (classInput.value || "—");

  SKILL_IDS.forEach((id) => {
    const previewId =
      "#preview" + id[0].toUpperCase() + id.slice(1);

    document.querySelector(previewId).textContent =
      document.querySelector("#" + id).value || "—";
  });

  preview.className = "character-card color-" + colorInput.value;

  pointsUsed.textContent = total;
  pointsLeft.textContent = TOTAL_SKILL_POINTS - total;

  document.querySelector("#previewStatus").textContent =
    total === TOTAL_SKILL_POINTS
      ? "Skill points total is 20."
      : "Skill points must total exactly 20.";
}

function handleFieldEvent(event) {
  const id = event.target.id;

  if (!id) {
    return;
  }

  if (event.type === "blur") {
    validateField(id);
  }

  if (event.type === "input" || event.type === "change") {
    if (event.target.dataset.touched === "true") {
      validateField(id);
    }

    updatePreview();
    formSummary.textContent = "";
  }
}

form.addEventListener("input", handleFieldEvent);
form.addEventListener("change", handleFieldEvent);

form.addEventListener("focusout", (event) => {
  if (event.target.id) {
    event.target.dataset.touched = "true";
    validateField(event.target.id);
  }
});


form.noValidate = true;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const errors = validateAll();
  updatePreview();

  if (errors.length > 0) {
    formSummary.textContent =
      "Please fix " + errors.length + " error(s).";

    formSummary.className = "message error-text";

    document.querySelector("#" + errors[0].id).focus();
    createdResult.hidden = true;

    return;
  }

  const values = skillValues();

  createdResult.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Character created successfully!";

  const details = document.createElement("p");
  details.textContent =
    nameInput.value.trim() + " · " + classInput.value +
    " · Strength " + values.strength +
    ", Magic " + values.magic +
    ", Agility " + values.agility +
    ", Defense " + values.defense;

  const code = document.createElement("p");
  code.textContent =
    "Character code: CH-" + Math.floor(1000 + Math.random() * 9000);

  createdResult.append(heading, details, code);
  createdResult.hidden = false;

  formSummary.textContent = "Character created.";
  formSummary.className = "message success-text";

  form.reset();

  SKILL_IDS.forEach((id) => {
    document.querySelector("#" + id).value = "5";
  });

  [
    "characterName",
    "characterClass",
    "characterColor",
    ...SKILL_IDS
  ].forEach((id) => {
    const element = document.querySelector("#" + id);

    element.removeAttribute("data-touched");
    element.setAttribute("aria-invalid", "false");

    document.querySelector("#" + id + "Error").textContent = "";
  });

  updatePreview();
});

[
  "characterName",
  "characterClass",
  "characterColor",
  ...SKILL_IDS
].forEach((id) => {
  document.querySelector("#" + id).setAttribute(
    "aria-invalid",
    "false"
  );
});

updatePreview();