import { home_circles } from "./lib/circle.js"
import { make_dark_color_less_variance, make_light_color_less_variance, make_background_color, navigate } from "./lib/theme.js"

const svg = document.getElementById("circles")
const box = document.getElementById("box")
const disclaimer = document.getElementById("disclaimer")
disclaimer.style.display = "inline" //it's none without script

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
const demos = document.getElementById("demos")
const resume = document.getElementById("resume")

make_navigate(about)
make_navigate(blog, a=>"./blog/index.html")
make_navigate(demos)
make_navigate(resume)


//do circle drawing stuff
const quadrant = 2
home_circles(quadrant % 2 + 2).forEach(a=>svg.appendChild(a));

//update styles based off quadrant
if (quadrant<2) {
  svg.style.transform = "rotate(180deg)"
}
if (quadrant>=2) {
  box.style.right = box.style.left; box.style.left = null
  disclaimer.style.left = disclaimer.style.right ; disclaimer.style.right = null
}
if (quadrant == 0 || quadrant == 3) {
  box.style.bottom = box.style.top; box.style.top = null
  disclaimer.style.top = disclaimer.style.bottom; disclaimer.style.bottom = null;
}

