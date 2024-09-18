import * as fs from "fs"
import { ROOT_DIR } from "./common.js"
import { create_recursive } from "../lib/resume.mjs"

//do resume stuff
const RESUME_STATIC_PATH = "/static/resume/"
const RESUME_PATH = "/resume/"
const RESUME_DATA_PATH = "/resume/data.json"

const data = JSON.parse(fs.readFileSync(ROOT_DIR + RESUME_DATA_PATH, "utf8"))
let res = create_recursive(data)

//create the document
const document = `
<head>
  <title>resume</title>
  <link rel="stylesheet" type="text/css" href="/common.css">
  <link id="switchstyle" rel="stylesheet" type="text/css" href="${RESUME_PATH}/styles/uninteresting.css">
</head>
<div id="resume">` + res + `</div>
<script>window.location.href="/resume"</script>`

fs.mkdirSync(ROOT_DIR + RESUME_STATIC_PATH, { recursive: true })
fs.writeFileSync(ROOT_DIR + RESUME_STATIC_PATH + "index.html", document)
console.log("Finished writing resume")

