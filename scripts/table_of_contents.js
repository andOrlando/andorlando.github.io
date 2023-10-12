import * as fs from "fs"
import assert from "assert"
import { ROOT_DIR } from "./common.js"
import { entries, BLOG_PATH } from "./blogs.js"

const TABLE_OF_CONTENTS_OUT="/static/blogs/table-of-contents/"

//create table of contents from markdown files
let res = ""

//first we add index.md and remove it
assert(entries.index, `You gotta have an index.md in ${BLOG_PATH} dude`)
res += `<a uid="index" href="/static/blogs/index">${entries.index.title}</a>`
delete entries.index;

for (const [name, data] of Object.entries(entries).filter(([_, a])=>!("category" in a)))
  res += `<a uid="${name}" href="/static/blogs/${name}">${data.title}</a>`

const categories = new Set()
for (const [name, data] of Object.entries(entries))
  if ("category" in data) categories.add(data.category)

for (const category of categories) {
  res += `<h1>${category}</h1>`
  for (const [name, data] of Object.entries(entries).filter(([_, a])=>a.category == category))
    res += `<a uid="${name}" href="/static/blogs/${name}">${data.title}</a>`
}

//finishint touches
res = `<div id="tableofcontents" style="max-width:600px;margin:auto;position:inherit">${res}</div>`
res = `<link rel="stylesheet" type="text/css" href="/blog/styles.css">` + res
res = `<link rel="stylesheet" type="text/css" href="/common.css">` + res

fs.mkdirSync(ROOT_DIR + TABLE_OF_CONTENTS_OUT, { recursive: true })
fs.writeFileSync(ROOT_DIR + TABLE_OF_CONTENTS_OUT + "index.html", res) 
console.log("Finished writing table of contents")
