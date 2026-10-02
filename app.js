const CATEGORIES = ["All", "Spine", "Shoulder", "Knee/Hip", "Ankle", "Neuro", "Geriatric"];

const searchInput = document.getElementById("search");
const chipsEl = document.getElementById("chips");
const listEl = document.getElementById("list");
const cardEl = document.getElementById("card");
const countEl = document.getElementById("result-count");

let activeCategory = "All";
let activeId = null;

function haystack(item) {
  const blobs = [
    item.name,
    item.category,
    item.snapshot,
    ...(item.aliases || []),
    ...(item.redFlags || []),
    ...(item.precautions || []),
    ...(item.assess || []),
    ...(item.treat || []),
    ...(item.options || []),
    ...(item.progress || []),
    ...(item.hep || []),
    ...(item.escalate || []),
  ];
  return blobs.join(" ").toLowerCase();
}

function filtered() {
  const query = searchInput.value.trim().toLowerCase();
  return DIAGNOSES.filter((item) => {
    if (activeCategory !== "All" && item.category !== activeCategory) return false;
    if (!query) return true;
    return haystack(item).includes(query);
  });
}

function renderChips() {
  chipsEl.replaceChildren();
  CATEGORIES.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = category;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", category === activeCategory ? "true" : "false");
    button.addEventListener("click", () => {
      activeCategory = category;
      render();
    });
    chipsEl.appendChild(button);
  });
}

function renderList(items) {
  listEl.replaceChildren();
  countEl.textContent = items.length === 1 ? "1 diagnosis" : `${items.length} diagnoses`;

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No diagnosis matches that search.";
    listEl.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "diag-btn";
    if (item.id === activeId) button.setAttribute("aria-current", "true");
    const name = document.createElement("span");
    name.textContent = item.name;
    const meta = document.createElement("small");
    meta.textContent = item.category;
    button.append(name, meta);
    button.addEventListener("click", () => select(item.id));
    listEl.appendChild(button);
  });
}

function addList(parent, title, items, className) {
  if (!items || !items.length) return;
  const block = document.createElement("div");
  block.className = className;
  const heading = document.createElement("h3");
  heading.textContent = title;
  const list = document.createElement(className === "options" ? "ol" : "ul");
  items.forEach((text) => {
    const li = document.createElement("li");
    const split = text.indexOf(": ");
    if (className === "options" && split > 0) {
      const name = document.createElement("strong");
      name.textContent = text.slice(0, split);
      li.append(name, document.createTextNode(": " + text.slice(split + 2)));
    } else {
      li.textContent = text;
    }
    list.appendChild(li);
  });
  block.append(heading, list);
  parent.appendChild(block);
}

function renderCard(item) {
  cardEl.replaceChildren();
  if (!item) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Select a diagnosis to open its card.";
    cardEl.appendChild(empty);
    return;
  }

  const top = document.createElement("div");
  top.className = "card-top";

  const headingWrap = document.createElement("div");
  const kicker = document.createElement("span");
  kicker.className = "kicker";
  kicker.textContent = item.category;
  const title = document.createElement("h2");
  title.textContent = item.name;
  const aliases = document.createElement("p");
  aliases.className = "aliases";
  aliases.textContent = (item.aliases || []).join(" · ");
  headingWrap.append(kicker, title, aliases);

  const printBtn = document.createElement("button");
  printBtn.type = "button";
  printBtn.className = "print-btn";
  printBtn.textContent = "Print card";
  printBtn.addEventListener("click", () => window.print());

  top.append(headingWrap, printBtn);

  const snapshot = document.createElement("p");
  snapshot.className = "snapshot";
  snapshot.textContent = item.snapshot;

  const sections = document.createElement("div");
  sections.className = "sections";
  addList(sections, "Data to collect", item.assess, "section");
  addList(sections, "Progress", item.progress, "section");
  addList(sections, "Home program", item.hep, "section");
  addList(sections, "Tell the supervising PT", item.escalate, "section");

  const note = document.createElement("p");
  note.className = "fine-print";
  note.textContent = "For a PTA carrying out a physical therapist's plan of care. Use only interventions the plan of care already includes. Weight-bearing status, surgeon precautions, and the physician order override this card. For a red flag, a new symptom, or no progress, stop and contact the supervising PT.";

  cardEl.append(top, snapshot);
  addList(cardEl, "Red flags", item.redFlags, "callout danger");
  addList(cardEl, "Precautions", item.precautions, "callout warn");
  addList(cardEl, "Session options", item.options, "options");
  cardEl.append(sections, note);
}

function select(id) {
  activeId = id;
  history.replaceState(null, "", `#${id}`);
  render();
}

function render() {
  const items = filtered();
  if (!items.some((item) => item.id === activeId)) {
    activeId = items[0] ? items[0].id : null;
  }
  if (activeId && location.hash !== `#${activeId}`) {
    history.replaceState(null, "", `#${activeId}`);
  }
  renderChips();
  renderList(items);
  renderCard(DIAGNOSES.find((item) => item.id === activeId));
}

searchInput.addEventListener("input", render);

const fromHash = location.hash.replace("#", "");
if (DIAGNOSES.some((item) => item.id === fromHash)) {
  activeId = fromHash;
}

render();
