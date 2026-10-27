// Task 2: Kanban board
const MAX_IN_PROGRESS = 3;

const columns = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" }
];

const tasks = [
  { id: 1, title: "Plan the page", tag: "planning", priority: "high", status: "todo", estimate: 2 },
  { id: 2, title: "Create the header", tag: "design", priority: "medium", status: "todo", estimate: 1 },
  { id: 3, title: "Build the layout", tag: "design", priority: "high", status: "progress", estimate: 3 },
  { id: 4, title: "Add navigation", tag: "html", priority: "medium", status: "progress", estimate: 2 },
  { id: 5, title: "Check colors", tag: "design", priority: "low", status: "progress", estimate: 1 },
  { id: 6, title: "Write JavaScript", tag: "javascript", priority: "high", status: "todo", estimate: 4 },
  { id: 7, title: "Test the form", tag: "testing", priority: "medium", status: "todo", estimate: 2 },
  { id: 8, title: "Fix small bugs", tag: "testing", priority: "low", status: "done", estimate: 1 },
  { id: 9, title: "Review mobile view", tag: "responsive", priority: "high", status: "todo", estimate: 2 },
  { id: 10, title: "Update README", tag: "documentation", priority: "low", status: "done", estimate: 1 }
];

const board = document.querySelector("#board");
const taskSearch = document.querySelector("#taskSearch");
const prioritySort = document.querySelector("#prioritySort");
const boardMessage = document.querySelector("#boardMessage");
const completedCount = document.querySelector("#completedCount");
const totalCount = document.querySelector("#totalCount");
const progressBar = document.querySelector("#progressBar");
const progressTrack = document.querySelector("#progressTrack");

function makeElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function render() {
  board.replaceChildren();

  const query = taskSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  columns.forEach((column) => {
    const columnElement = makeElement("section", "board-column");

    const columnTasks = tasks.filter(
      (task) => task.status === column.id
    );

    const heading = makeElement("h3", "", column.title + " ");
    heading.append(
      makeElement("span", "column-count", "(" + columnTasks.length + ")")
    );

    columnElement.append(heading);

    let displayedTasks = columnTasks.filter((task) =>
      task.title.toLowerCase().includes(query) ||
      task.tag.toLowerCase().includes(query)
    );

    if (prioritySort.value === "high") {
      const rank = { high: 1, medium: 2, low: 3 };

      displayedTasks = [...displayedTasks].sort(
        (a, b) => rank[a.priority] - rank[b.priority]
      );
    }

    if (displayedTasks.length === 0) {
      columnElement.append(
        makeElement(
          "p",
          "empty-state",
          query ? "No matching tasks." : "No tasks here."
        )
      );
    }

    displayedTasks.forEach((task) => {
      visibleCount++;

      const card = makeElement(
        "article",
        "task-card priority-" + task.priority
      );

      card.append(makeElement("h4", "", task.title));
      card.append(makeElement("p", "", "Tag: " + task.tag));
      card.append(makeElement("p", "", "Priority: " + task.priority));
      card.append(
        makeElement("p", "", "Estimate: " + task.estimate + " hour(s)")
      );

      const actions = makeElement("div", "card-actions");

      const moves = [
        { status: "todo", label: "To Do" },
        { status: "progress", label: "In Progress" },
        { status: "done", label: "Done" }
      ];

      moves.forEach((move) => {
        const button = makeElement("button", "secondary", move.label);

        button.type = "button";
        button.dataset.taskId = String(task.id);
        button.dataset.newStatus = move.status;
        button.disabled = task.status === move.status;

        button.setAttribute(
          "aria-label",
          "Move " + task.title + " to " + move.label
        );

        actions.append(button);
      });

      card.append(actions);
      columnElement.append(card);
    });

    board.append(columnElement);
  });

  if (visibleCount === 0) {
    boardMessage.textContent = "No tasks found. Try another search.";
    boardMessage.className = "message error-text";
  } else {
    boardMessage.textContent = "";
    boardMessage.className = "message";
  }

  
  let finished = 0;

  for (const task of tasks) {
    if (task.status === "done") {
      finished++;
    }
  }

  completedCount.textContent = finished;
  totalCount.textContent = tasks.length;

  const percent = tasks.length === 0
    ? 0
    : Math.round((finished / tasks.length) * 100);

  // Use CSS classes for the progress bar width.
  const roundedPercent = Math.round(percent / 10) * 10;

  progressBar.className = "progress-bar progress-" + roundedPercent;
  progressTrack.setAttribute("aria-valuenow", String(percent));
}

// One delegated listener handles all task buttons.
board.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-task-id]");

  if (!button || !board.contains(button)) {
    return;
  }

  const task = tasks.find(
    (item) => item.id === Number(button.dataset.taskId)
  );

  if (!task) {
    return;
  }

  const newStatus = button.dataset.newStatus;

  if (
    newStatus === "progress" &&
    task.status !== "progress" &&
    tasks.filter((item) => item.status === "progress").length >= MAX_IN_PROGRESS
  ) {
    boardMessage.textContent =
      "Move blocked: In Progress can contain only 3 tasks.";
    boardMessage.className = "message error-text";
    return;
  }

  task.status = newStatus;

  render();

  boardMessage.textContent = "Task moved successfully.";
  boardMessage.className = "message success-text";
});

taskSearch.addEventListener("input", render);
prioritySort.addEventListener("change", render);

render();