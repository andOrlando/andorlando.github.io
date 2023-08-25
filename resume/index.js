import {
  make_light_color_less_variance,
  make_dark_color_less_variance,
  get_theme
} from "/lib/theme.js"

document.body.style.setProperty("--light", make_light_color_less_variance())
document.body.style.setProperty("--dark", make_dark_color_less_variance())
document.body.style.setProperty("--accent", get_theme())

for (const elem of document.querySelectorAll(".tag")) {
  elem.style.background = make_light_color_less_variance()
}

