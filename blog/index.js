import { get_raw } from "/lib/fs.js"
import { blog_sidebar_circles } from "/lib/circle.js"
import {
  get_theme,
  make_darker_background_color,
  make_darkest_background_color,
  make_even_darker_background_color,
  make_light_color_less_variance,
  make_dark_color_less_variance,
} from "../lib/theme.js"

const sidebar = document.getElementById("sidebar")
const blogcanvas = document.getElementById("blogcanvas")
const svg = document.getElementById("canvas")

//do colors
document.body.style.setProperty("--light", make_light_color_less_variance())
document.body.style.setProperty("--dark", make_dark_color_less_variance())
document.body.style.setProperty("--darker", make_even_darker_background_color())
document.body.style.setProperty("--accent", get_theme())
blogcanvas.style.background = make_darkest_background_color()
svg.style.background = make_darker_background_color()

//setup hamburger
document.getElementById("hamburger")
  .addEventListener("click", ()=>sidebar.classList.toggle("hidden"))

//do circles
const circles = blog_sidebar_circles()
circles.forEach(a=>svg.appendChild(a))

//function to load blogs
let selected;
async function select_blog(element, link) {
  if (element == selected) return
  if (selected) selected.classList.remove("selected")
  selected = element
  selected.classList.add("selected")
  
  const blog = await get_raw(link)
  blogcanvas.innerHTML = blog
    .replace(/<head>[\s\S]*?<\/head>/, "")
    .replace(/<script>.*?<\/script>/, "")
    .replace(/<body>(.*)<\/body>/, "$1")
    .trim()

  
  window.history.replaceState(null, "", link)
}

//async stuff (thanks javascript)
(async ()=>{
  
  //populate sidebar
  console.log(await get_raw("/static/blogs/table-of-contents/index.html"))
  const table_of_contents = (await get_raw("/static/blogs/table-of-contents/index.html"))
    .replace(/<head>[\s\S]*?<\/head>/, "")
    .replace(/style=".*?"/, "")
  sidebar.insertAdjacentHTML("beforeend", table_of_contents)
  
  //remove hrefs and do onclicks
  for (const bloglink of document.querySelectorAll("#tableofcontents a")) {
    const link = bloglink.getAttribute("href")
    bloglink.addEventListener("click", ()=>select_blog(bloglink, link))
    bloglink.removeAttribute("href")
  }
  
  //set initially selected
  let uid="index"
  if (localStorage.preserveBlog) {
    uid = localStorage.preserveBlog
    localStorage.removeItem("preserveBlog")
  }
  document.querySelector(`[uid=${uid}]`).click()
 
})()

