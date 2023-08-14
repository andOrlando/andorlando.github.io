import * as fs from "fs"
import { marked, ROOT_DIR } from "./common.js"

export const BLOG_PATH="/blog/blogs/"
const ASSET_PATH="/blog/assets/"
const BLOG_OUT="/static/blogs/"

//marked stuff
let base = ""
const baseUrl = { walkTokens: token => {
  if (!['image'].includes(token.type)) return
  token.href = base + token.href
}}
marked.use(baseUrl)


//get all blogs
const blogs = fs.readdirSync(ROOT_DIR + BLOG_PATH, "utf8")
export let entries = {}

//use marked to convert them into html and place them into blog_out
for (const blog of blogs) {
  
  const name = blog.replace(/.md/, "")
  entries[name] = {}
  entries[name].name = blog
  
  let raw = fs.readFileSync(ROOT_DIR + BLOG_PATH + blog, "utf8")
  let res = ""
  
  //get first line and remove
  const title = raw.slice(0, raw.indexOf("\n"))
  raw = raw.slice(raw.indexOf("\n")+1)
  res += `<h1 class="bigtitle">${title}</h1>`
  res += `<div class="metadata"><strong>name</strong>: ${name}.md</div>`
  entries[name].title = title


  //get second line
  const metadata = raw.slice(0, raw.indexOf("\n")).matchAll(/(\w.*?):\s?(.*?);/g)
  raw = raw.slice(raw.indexOf("\n")+1)
  for (const [_, key, value] of metadata) {
    res += `<div class="metadata"><strong>${key}</strong>: ${value}</div>`
    entries[name][key] = value
  }
  
  //if next line is empty, remove it
  if (raw.match(/^\n/)) raw = raw.slice(raw.indexOf("\n")+1)
  
  //set base url and parse
  base = ASSET_PATH + name + "/"
  res += marked.parse(raw)
  
  //extra stuff
  res = `<body><div id="blog">${res}</div></body>` 

  res = `<link rel="stylesheet" type="text/css" href="/blog/atom-one-dark-reasonable.css">${res}`
  res = `<link rel="stylesheet" type="text/css" href="/blog/styles.css">${res}`
  res = `<head><title>${title}</title></head>${res}`

  res = `${res}<script>localStorage.preserveBlog="${name}";window.location.href="/blog"</script>`
  
  fs.mkdirSync(ROOT_DIR + BLOG_OUT + name, { recursive: true })
  fs.writeFileSync(ROOT_DIR + BLOG_OUT + name + "/index.html", res)
  
  //copy all assets
  
  console.log(`Finsihed writing ${blog}`)
}

//undo base url
base = ""
