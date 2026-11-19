/**
 * =================
 * Transpiled with transpile.ts, see transpile.ignore
 * =================
 */
const WRAPPERS = ".layout-right :is(.input-wrapper, .checkbox-wrapper, .radio-wrapper)";
const CONTROLS = "input, select, textarea";
const formEl = document.querySelector(".layout-right form");
const sourceEl = document.querySelector("#source");
const rangeEl = document.querySelector("#range");
const copyButton = document.querySelector("#source-copy");
document.body.addEventListener("change", (e) => {
  const el = e.target;
  const wrappers = document.querySelectorAll(WRAPPERS);
  if (el.id === "toggle-all-errors") {
    wrappers.forEach((w) => setError(w, el.checked));
    return;
  }
  if (el.id === "toggle-all-disabled") {
    wrappers.forEach((w) => {
      w.querySelectorAll(CONTROLS).forEach((control) => {
        control.disabled = el.checked;
      });
    });
    return;
  }
  if (el.id === "toggle-helper-all") {
    wrappers.forEach((w) => w.classList.toggle("hide-helper", el.checked));
    return;
  }
});
function setError(wrapper, on) {
  wrapper.toggleAttribute("data-error", on);
  wrapper.querySelectorAll(CONTROLS).forEach((control) => {
    const ids = [control.id + "-helper"];
    if (on) {
      ids.push(control.id + "-error");
      control.setAttribute("aria-invalid", "true");
    } else {
      control.removeAttribute("aria-invalid");
    }
    const existing = ids.filter((id) => document.getElementById(id));
    if (existing.length) {
      control.setAttribute("aria-describedby", existing.join(" "));
    } else {
      control.removeAttribute("aria-describedby");
    }
  });
}
const elementToSource = /* @__PURE__ */ new Map();
const VOID = ["input", "br", "hr", "img", "meta", "link"];
const INLINE = ["a", "b", "i", "em", "strong", "span", "code", "small"];
const MAX_LINE = 90;
function span(className, text2) {
  const s = document.createElement("span");
  if (className) s.className = className;
  if (text2 !== void 0) s.textContent = text2;
  return s;
}
function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/ /g, "&nbsp;");
}
function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function tagName(node) {
  return node instanceof Element ? node.tagName.toLowerCase() : "";
}
function attributes(el) {
  const type = (el.getAttribute("type") || "text").toLowerCase();
  const attrs = new Map(Array.from(el.attributes).map((a) => [a.name, a.value]));
  attrs.delete("style");
  const flag = (name, on) => on ? attrs.set(name, "") : attrs.delete(name);
  if (el instanceof HTMLInputElement) {
    if (type === "checkbox" || type === "radio") {
      flag("checked", el.checked);
    } else if (!["submit", "button", "reset", "password", "file", "hidden"].includes(type)) {
      if (el.value === "") {
        attrs.delete("value");
      } else {
        attrs.set("value", el.value);
      }
    }
  }
  if (el instanceof HTMLOptionElement) {
    flag("selected", el.selected);
  }
  return Array.from(attrs, ([name, value]) => value === "" ? name : `${name}="${escapeAttr(value)}"`);
}
function openTag(el, indent) {
  const tag = tagName(el);
  const attrs = attributes(el);
  const end = VOID.includes(tag) ? " />" : ">";
  const oneLine = `<${tag}${attrs.map((a) => " " + a).join("")}${end}`;
  if (indent.length + oneLine.length <= MAX_LINE || attrs.length < 2) {
    return oneLine;
  }
  return `<${tag}
${attrs.map((a) => `${indent}  ${a}
`).join("")}${indent}${end.trim()}`;
}
function text(node) {
  return (node.textContent || "").replace(/\s+/g, " ").trim();
}
function isInline(node) {
  return node.nodeType === Node.TEXT_NODE || INLINE.includes(tagName(node));
}
function renderInline(node, target) {
  if (!(node instanceof Element)) {
    target.append((node.textContent || "").replace(/\s+/g, " "));
    return;
  }
  const box = span("src-el");
  elementToSource.set(node, box);
  target.append(box);
  box.append(span("src-tag", openTag(node, "")));
  node.childNodes.forEach((c) => renderInline(c, box));
  box.append(span("src-tag", `</${tagName(node)}>`));
}
function render(node, indent, target) {
  if (node.nodeType === Node.COMMENT_NODE) {
    const lines = (node.textContent || "").split("\n");
    const strip = Math.min(
      ...lines.slice(1).filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length)
    );
    const body = lines.map((l, i) => i === 0 ? l : l.trim() ? indent + l.slice(isFinite(strip) ? strip - 2 : 0) : "").join("\n").replace(/\s+$/, lines.length > 1 ? "\n" + indent : " ");
    target.append(indent, span("src-comment", `<!--${body}-->`), "\n");
    return;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    const t = text(node);
    if (t) target.append(indent + t + "\n");
    return;
  }
  if (!(node instanceof Element)) return;
  const tag = tagName(node);
  const box = span("src-el");
  elementToSource.set(node, box);
  target.append(indent, box, "\n");
  box.append(span("src-tag", openTag(node, indent)));
  if (VOID.includes(tag)) return;
  if (node instanceof HTMLTextAreaElement) {
    box.append(escapeText(node.value), span("src-tag", `</${tag}>`));
    return;
  }
  const children = Array.from(node.childNodes).filter((c) => c.nodeType !== Node.TEXT_NODE || text(c));
  const onlyText = children.every((c) => c.nodeType === Node.TEXT_NODE);
  const inner = text(node);
  if (onlyText && indent.length + inner.length + tag.length * 2 < MAX_LINE + 20) {
    box.append(inner);
  } else if (children.every(isInline)) {
    const line = span();
    children.forEach((c) => renderInline(c, line));
    const first = line.firstChild;
    const last = line.lastChild;
    if (first.nodeType === Node.TEXT_NODE) first.textContent = (first.textContent || "").trimStart();
    if (last.nodeType === Node.TEXT_NODE) last.textContent = (last.textContent || "").trimEnd();
    box.append("\n" + indent + "  ", line, "\n" + indent);
  } else {
    box.append("\n");
    children.forEach((c) => render(c, indent + "  ", box));
    box.append(indent);
  }
  box.append(span("src-tag", `</${tag}>`));
}
function renderSource() {
  const scroll = sourceEl.scrollTop;
  elementToSource.clear();
  sourceEl.textContent = "";
  render(formEl, "", sourceEl);
  sourceEl.scrollTop = scroll;
}
renderSource();
let hovered = null;
function highlight(el, scroll = false) {
  const old = sourceEl.querySelector(".src-hover");
  if (old) old.classList.remove("src-hover");
  hovered = el;
  const box = el && elementToSource.get(el);
  if (!box) return;
  box.classList.add("src-hover");
  if (!scroll) return;
  const pre = sourceEl.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  if (b.top < pre.top || b.bottom > pre.bottom) {
    const margin = Math.max(20, (pre.height - b.height) / 2);
    sourceEl.scrollTop += b.top - pre.top - margin;
  }
}
formEl.addEventListener("mouseover", (e) => {
  let el = e.target;
  while (el && !elementToSource.has(el)) el = el.parentElement;
  if (el !== hovered) highlight(el, true);
});
formEl.addEventListener("mouseleave", () => highlight(null));
let scheduled = false;
function scheduleRender() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    renderSource();
    highlight(hovered);
  });
}
formEl.addEventListener("input", scheduleRender);
formEl.addEventListener("change", scheduleRender);
formEl.addEventListener("reset", () => setTimeout(scheduleRender));
new MutationObserver((mutations) => {
  if (mutations.some((m) => m.attributeName !== "style")) scheduleRender();
}).observe(formEl, { attributes: true, childList: true, characterData: true, subtree: true });
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(sourceEl.textContent || "");
  copyButton.textContent = "copied";
  setTimeout(() => copyButton.textContent = "copy all", 1500);
});
const realWidth = formEl.getBoundingClientRect().width;
function applyWidth() {
  const percent = parseInt(rangeEl.value, 10) / 100;
  formEl.style.width = Math.floor(realWidth * percent) + "px";
}
rangeEl.addEventListener("change", applyWidth);
rangeEl.addEventListener("input", applyWidth);
applyWidth();
document.body.addEventListener("input", (e) => {
  const t = e.target;
  if (t instanceof HTMLTextAreaElement) {
    t.style.height = "auto";
    t.style.height = t.scrollHeight + (t.offsetHeight - t.clientHeight) + "px";
  }
});
