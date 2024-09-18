import {
  make_light_color_less_variance,
  make_dark_color_less_variance,
  get_theme
} from "/lib/theme.js"
import { create_recursive } from "../lib/resume.mjs"
import { get_raw } from "../lib/fs.js"

document.body.style.setProperty("--light", make_light_color_less_variance())
document.body.style.setProperty("--dark", make_dark_color_less_variance())
document.body.style.setProperty("--accent", get_theme())

for (const elem of document.querySelectorAll(".tag")) {
  elem.style.background = make_light_color_less_variance()
}

const resume = document.getElementById("resume")
const editor = document.getElementById("editor")
const edit = document.getElementById("edit")
const exp = document.getElementById("export")
const switchbutton = document.getElementById("switchbutton");

(async () => {
  const data_str = await get_raw("/resume/data.json")
  const data = JSON.parse(data_str)

  resume.innerHTML = create_recursive(data)
  editor.value = data_str
})();

editor.addEventListener("input", () => {

  const data_str = editor.value
  const data = JSON.parse(data_str)

  resume.innerHTML = create_recursive(data)
})

const styles = ["default", "uninteresting"].map(a => `/resume/styles/${a}.css`)
let idx = 0

switchbutton.addEventListener("click", () => {
  idx = (idx + 1) % styles.length
  document.getElementById("switchstyle").setAttribute("href", styles[idx])
})

edit.addEventListener("click", () => {
  editor.hidden ^= 1
})

exp.addEventListener("click", () => {
  const blob = new Blob([editor.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'data.json';
  link.href = window.URL.createObjectURL(blob);
  link.click();
  window.URL.revokeObjectURL(link.href);
})

