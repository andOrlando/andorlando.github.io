import {
  make_light_color_less_variance,
  make_dark_color_less_variance,
  get_theme
} from "/lib/theme.js"
// import { get_raw } from "/lib/fs.js"

document.body.style.setProperty("--light", make_light_color_less_variance())
document.body.style.setProperty("--dark", make_dark_color_less_variance())
document.body.style.setProperty("--accent", get_theme())

for (const elem of document.querySelectorAll(".tag")) {
  elem.style.background = make_light_color_less_variance()
}

/*
//do async things
(async () => {

  //get the link and append it
  const resume = await get_raw("/static/resume")
  document.getElementById("content").innerHTML = resume
    .replace(/<link.*?>/, "")
    .replace(/<link.*?>/, "")
    .replace(/<head>.*?<\/head>/, "")
    .replace(/<script>.*?<\/script>/, "")
    .replace(/<body>(.*)<\/body>/, "$1")
    .trim()

})()
*/
