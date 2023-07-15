import { marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"
import * as fs from "fs"
import assert from "assert"

//consts
const BLOG_PATH="../blog/blogs/"
const BLOG_OUT="../static/blogs/"
const TABLE_OF_CONTENTS_OUT="../static/table_of_contents.html"

//set up marked
const options = markedHighlight({
  /*langPrefix: 'hljs language-',*/
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    let res = hljs.highlight(code, { language }).value;
    return res
  }
})
options.mangle = false;
options.headerIds = false;

marked.use(options);

//get all blogs
const blogs = fs.readdirSync(BLOG_PATH, "utf8")
let entries = {}

//use marked to convert them into html and place them into blog_out
for (const blog of blogs) {
  
  const name = blog.replace(/.md/, "")
  entries[name] = {}
  entries[name].name = blog
  
  let raw = fs.readFileSync(BLOG_PATH + blog, "utf8")
  let res = ""
  
  //get first line and remove
  const title = raw.slice(0, raw.indexOf("\n"))
  raw = raw.slice(raw.indexOf("\n")+1)
  res += `<h1 class="bigtitle">${title}</h1>\n`
  res += `<div class="metadata"><strong>name</strong>: ${name}.md</div>\n`
  entries[name].title = title


  //get second line
  const metadata = raw.slice(0, raw.indexOf("\n")).matchAll(/(\w.*?):\s?(.*?);/g)
  raw = raw.slice(raw.indexOf("\n")+1)
  for (const [_, key, value] of metadata) {
    res += `<div class="metadata"><strong>${key}</strong>: ${value}</div>\n`
    entries[name][key] = value
  }
  
  //if next line is empty, remove it
  if (raw.match(/^\n/)) raw = raw.slice(raw.indexOf("\n")+1)
  
  res += marked.parse(raw)
  
  //extra stuff
  res = `<body><div id="blog">\n${res}</div></body>\n` 

  res = `<link rel="stylesheet" type="text/css" href="../../blog/atom-one-dark-reasonable.css">\n${res}`
  res = `<link rel="stylesheet" type="text/css" href="../../blog/styles.css">\n${res}`
  res = `<head><title>${title}</title></head>\n${res}`

  res = `${res}<script>localStorage.preserveBlog="${name}";window.location.href="../../blog/index.html"</script>\n`
  
  fs.writeFileSync(BLOG_OUT + blog.replace(/.md/, ".html"), res)
  console.log(`Finsihed writing ${blog}`)
}

//create table of contents from markdown files
let res = ""

//first we add index.md and remove it
assert(entries.index, `You gotta have an index.md in ${BLOG_PATH} dude`)
res += `<a uid="index" href="./blogs/index.html">${entries.index.title}</a>`
delete entries.index;

for (const [name, data] of Object.entries(entries).filter(([_, a])=>!("category" in a)))
  res += `<a uid="${name}" href="./blogs/${name}.html">${data.title}</a>\n`

const categories = new Set()
for (const [name, data] of Object.entries(entries))
  if ("category" in data) categories.add(data.category)

for (const category of categories) {
  res += `<h1>${category}</h1>\n`
  for (const [name, data] of Object.entries(entries).filter(([_, a])=>a.category == category))
    res += `<a uid="${name}" href="./blogs/${name}.html">${data.title}</a>\n`
}

//finishint touches
res = `<div id="tableofcontents" style="max-width:600px;margin:auto;position:inherit">\n${res}</div>\n`
res = `<link rel="stylesheet" type="text/css" href="../blog/styles.css">\n` + res

fs.writeFileSync(TABLE_OF_CONTENTS_OUT, res) 
console.log("Finished writing table of contents")
