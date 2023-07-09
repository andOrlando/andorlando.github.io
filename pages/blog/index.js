import { get_raw, get_metadata, generate_table_of_contents, generate_blog } from "../../lib/blog.js"
import { blog_sidebar_circles } from "../../lib/circle.js"
import {
  make_background_color,
  get_theme,
  make_dark_color,
  make_darker_background_color,
  make_darkest_background_color,
  make_even_darker_background_color,
  make_light_color_less_variance,
  make_dark_color_less_variance,
} from "../../lib/theme.js"

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

//select callback for blogs
let selected;
async function select_blog(element, name, data) {
  if (selected) selected.classList.remove("selected")
  selected = element
  selected.classList.add("selected")

  const blog = await generate_blog("./blogs/", name, data)
  blogcanvas.replaceChildren(blog)
}

//async stuff (thanks javascript)
(async ()=>{
 
  //populate sidebar
  const data = await get_metadata("./blogs/metadata.json")
  const table_of_contents = generate_table_of_contents(data, select_blog)
  sidebar.appendChild(table_of_contents)

  //select index which is selected in css from generate_table_of_contents
  document.querySelector("a.selected").onclick()
})()