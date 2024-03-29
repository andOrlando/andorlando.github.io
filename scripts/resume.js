import * as fs from "fs"
import { ROOT_DIR } from "./common.js"

//do resume stuff
const RESUME_STATIC_PATH = "/static/resume/"
const RESUME_PATH = "/resume/"
const RESUME_DATA_PATH = "/resume/data.json"

function create_root({ links, content }, res, depth) {
  let info = `<div class="info">${res}</div>`
  let linksbox = ""
  for (const { name, link, icon } of links)
    linksbox += `<div class="link">${icon}<a href=${link}>${name}</a></div>`
  
  linksbox = `<div class="links">` + linksbox + `</div>`
  
  let header = `<div class="header">` + info + linksbox + `</div>`

  let children = ""
  for (const item of content) {
    if (item.exclude) continue
    children += create_recursive(item, depth+1)
  }
  
  
  children = `<div class="children">` + children + `</div>`
  
  return header + children
}

function create_kv({ content }, res) {
  let pairs = ""
  for (const [key, value] of content)
    pairs += `<span class="key">${key}</span><span class="value">${value}</span><br>`
  
  return res + pairs
}

function create_tags({ content }, res) {
  let tags = ""
  for (const [tag, color] of content) {
    let style = color ? `style="--color:${color}"` : ""
    tags += `<div class="tag"${style}>${tag}</div>`
  }
  
  return res + `<div class="tagbox">` + tags + `</div>`
}

function create_bullets({ content }, res) {
  let bullets = ""
  for (const bullet of content)
    bullets += `<li class="bullet">${bullet}</li>`
  
  return res + `<ul>` + bullets + `</ul>`
}

const create_map = {
  "root": create_root,
  "kv": create_kv,
  "tags": create_tags,
  "bullets": create_bullets
}

//title, subtitle, description, date, content
function create_recursive(obj, depth=0) {
  let res = ""
  
  //do basic stuff
  if (obj.title) res += `<span class="title">${obj.title}</span>`
  if (obj.date) res += `<span class="date">${obj.date}</span>`
  if (obj.subtitle) res += `<span class="subtitle">${obj.subtitle}</span>`
  if (obj.description) res += `<span class="description">${obj.description}</span>`
  
  //if it has a type then do special type stuff
  if (obj.type) res = create_map[obj.type](obj, res, depth)
  else if (obj.content) for (const item of obj.content) {
    if (item.exclude) continue
    res += create_recursive(item, depth+1)
  }
  
  //finish it off
  let type = "type" in obj ? " " + obj.type : ""
  return `<div class="depth-${depth}${type}">` + res + `</div>`
}

const data = JSON.parse(fs.readFileSync(ROOT_DIR + RESUME_DATA_PATH, "utf8"))
let res = create_recursive(data)

//create style switching buttons
const styles = fs.readdirSync(ROOT_DIR + RESUME_PATH + "styles/", "utf8")
const switch_script = `
const styles = [${styles.map(a => `"${a}"`).join(",")}]
let idx = styles.indexOf("default.css")

document.getElementById("switchbutton").addEventListener("click", () => {
  idx = (idx + 1) % styles.length
  document.getElementById("switchstyle").setAttribute("href", "${RESUME_PATH}/styles/" + styles[idx])
})`

//create the document
const document = `
<head>
  <title>resume</title>
  <link rel="stylesheet" type="text/css" href="/common.css">
  <link id="switchstyle" rel="stylesheet" type="text/css" href="${RESUME_PATH}/styles/default.css">
</head>
<div id="resume">` + res + `</div>
<div style="position: fixed; top: 0">
<button id="switchbutton">switch style</button>
<button onclick="document.querySelectorAll('button').forEach(a => a.remove())">kill both</button>
</div>
<script>`+ switch_script + `</script>
<script src="${RESUME_PATH}/index.js" type="module"></script>`

fs.mkdirSync(ROOT_DIR + RESUME_STATIC_PATH, { recursive: true })
fs.writeFileSync(ROOT_DIR + RESUME_STATIC_PATH + "index.html", document)
console.log("Finished writing resume")

