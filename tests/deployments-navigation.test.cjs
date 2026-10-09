const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const listeners = new Map();
const dialog = {
  open: false,
  showModal() { this.open = true; },
  close() { this.open = false; }
};
const content = { innerHTML: "" };
const position = { textContent: "" };
const elements = {
  "deployment-record-dialog": dialog,
  "deployment-record-content": content,
  "deployment-record-position": position
};
const general = {
  tabs: [{ id: "briefing" }],
  tabGroups: [{ id: "briefing", tabs: ["briefing"] }]
};
const document = {
  getElementById(id) { return elements[id]; },
  addEventListener(type, listener) {
    if (!listeners.has(type)) listeners.set(type, []);
    listeners.get(type).push(listener);
  }
};

vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, "..", "deployments-records.js"), "utf8"),
  { window: { UFN_CONTENT: { general } }, document, Date }
);

const page = general.tabs.find(tab => tab.id === "deployments").content;
const codes = [...page.matchAll(/<span class="deployment-tile-code">(OP\d+)<\/span>/g)]
  .map(match => match[1]);
const indexes = [...page.matchAll(/data-deployment-index="(\d+)"/g)]
  .map(match => Number(match[1]));
assert.deepEqual(codes, Array.from({ length: 14 }, (_, i) => `OP${String(i + 1).padStart(2, "0")}`));
assert.deepEqual(indexes, Array.from({ length: 15 }, (_, i) => i));
assert.match(page, /14 standalone missions and 6 campaign missions/);

function click(index, action) {
  const target = {
    closest(selector) {
      if (selector === "[data-deployment-index]" && index !== undefined) {
        return { dataset: { deploymentIndex: String(index) } };
      }
      if (selector === "[data-record-action]" && action) {
        return { dataset: { recordAction: action } };
      }
      return null;
    }
  };
  listeners.get("click")[0]({ target });
}

click(2);
for (let i = 2; i <= 13; i++) {
  assert.match(content.innerHTML, new RegExp(`<strong>OP${String(i + 1).padStart(2, "0")}</strong>`));
  assert.equal(position.textContent, `${String(i + 1).padStart(2, "0")} / 14`);
  click(undefined, "next");
}
assert.match(content.innerHTML, /CAMPAIGN-LD|CAMPAIGN RECORD/);
click(undefined, "next");
assert.match(content.innerHTML, /<strong>OP01<\/strong>/);
click(undefined, "previous");
assert.match(content.innerHTML, /CAMPAIGN-LD|CAMPAIGN RECORD/);
click(undefined, "previous");
assert.match(content.innerHTML, /<strong>OP14<\/strong>/);
click(12);
assert.match(content.innerHTML, /<strong>OP13<\/strong>/);
click(13);
assert.match(content.innerHTML, /<strong>OP14<\/strong>/);

let prevented = false;
listeners.get("keydown")[0]({
  key: "ArrowLeft",
  preventDefault() { prevented = true; }
});
assert.equal(prevented, true);
assert.match(content.innerHTML, /<strong>OP13<\/strong>/);

console.log("Deployment cards and Previous/Next cover OP01–OP14 and the campaign record.");
