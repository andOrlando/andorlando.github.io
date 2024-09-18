import { home_circles } from "./lib/circle.js"
import { make_dark_color_less_variance, make_light_color_less_variance, make_background_color, navigate } from "./lib/theme.js"

const svg = document.getElementById("circles")

//do colors
document.body.style.setProperty("--dark", make_dark_color_less_variance())
document.body.style.setProperty("--light", make_light_color_less_variance())
document.body.style.background = make_background_color()

//make links work
function make_navigate(element, modify_link=a=>a) {
  const href = modify_link(element.getAttribute("href"))
  element.removeAttribute("href")
  element.addEventListener("click", ()=>navigate(href))
}

const about = document.getElementById("about")
const blog = document.getElementById("blog")
// const demos = document.getElementById("demos")
const resume = document.getElementById("resume")



make_navigate(about)
make_navigate(blog, ()=>"blog")
// make_navigate(demos)
make_navigate(resume, ()=>"resume")


//do circle drawing stuff
home_circles(window.quadrant % 2 + 2).forEach(a=>svg.appendChild(a));

//update styles based off quadrant

