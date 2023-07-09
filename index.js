import { home_circles } from "./lib/circle.js"
import { make_dark_color_less_variance, make_light_color_less_variance, make_background_color, navigate } from "./lib/theme.js"

const svg = document.getElementById("circles")

//do colors
document.body.style.setProperty("--dark", make_dark_color_less_variance())
document.body.style.setProperty("--light", make_light_color_less_variance())
document.body.style.background = make_background_color()

//make links work
document.getElementById("about").addEventListener("click", ()=>navigate("./pages/about/index.html"))
document.getElementById("blog").addEventListener("click", ()=>navigate("./pages/blog/index.html"))
document.getElementById("demos").addEventListener("click", ()=>navigate("./pages/demos/index.html"))
document.getElementById("resume").addEventListener("click", ()=>navigate("./pages/resume/index.html"))

//do circle drawing stuff
const quadrant = 2 
if (quadrant&2^1) svg.style.rotate = "180deg"
home_circles(quadrant % 2 + 2).forEach(a=>svg.appendChild(a));

//TODO: move text

