import { weighted_random, skewed_random } from "./random.js"
import {
  make_dark_color,
  make_med_color,
  make_light_color,
  make_darker_background_color,
  make_darkest_background_color
} from "./theme.js"

function create_circle_dom(cx, cy, r, fill) {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", cx)
  circle.setAttribute("cy", cy)
  circle.setAttribute("r", r)
  circle.setAttribute("fill", fill)
  return circle
}

function calc_radius_overlap([x1, y1, r1], [x2, y2, r2]) {
  const d = Math.sqrt((x2-x1)**2+(y2-y1)**2)
  return Math.max(r1/d, r2/d)
}

function ensure_no_overlap(make_xyr, group, thresh, n=0) {
  const xyr = make_xyr()
  if (group.reduce((res,c)=>res||calc_radius_overlap(xyr,c)>(thresh+0.01*n),false))
    return ensure_no_overlap(make_xyr, group, thresh, n+1)
  
  if (n) console.log(n)
  return xyr
}

export function blog_sidebar_circles() {
  
  const n_med_circles = Math.round(skewed_random(1/5, 2, 5))
  const n_small_bois = Math.round(skewed_random(2, 2, 6))
  
  const circles = []
  const small_bois = []  
  
  for (let i=0; i<n_med_circles; i++) {
    let [x,y,r]=[weighted_random(3, -10, 110), weighted_random(3, -10, 90), weighted_random(1/3, 200, 300)]
    circles.push(create_circle_dom(x+"%", y+"px", r+"px", make_darkest_background_color()))
  }
  
  for (let i=0; i<n_small_bois; i++) {
    let make_xyr=()=>[weighted_random(1, -10, 110), weighted_random(1, -20, 480), weighted_random(1/3, 60, 140)]
    let [x,y,r]=ensure_no_overlap(make_xyr, small_bois, 0.85)
    circles.push(create_circle_dom(x+"%", y+"px", r+"px", make_darker_background_color()))
  }
  
  return circles
}

export function home_circles(factor) {
  
  const distribute=t=>[
      Math.sin(Math.PI/2*(t+factor))+(factor&1^1),
      Math.cos(Math.PI/2*(t+factor))+1]

  const n_big_boys = Math.round(skewed_random(1/5, 1, 3))
  const n_med_circles = Math.round(skewed_random(1/3, 2, 3))
  const n_small_bois = Math.round(weighted_random(1/4, 3, 7))

  const circles = []
  const med_circles = []
  const small_bois = []

  for(let i=0; i<n_big_boys; i++) {

    let [x,y,r]=[...distribute(weighted_random(1/2)),
      weighted_random(1/2, 35, 70).toFixed(2)]

    y=(y*90).toFixed(2); x=(x*40).toFixed(2)

    circles.push(create_circle_dom(x+"vh", 100-y+"vh", r+"vh", make_dark_color()))
  }
  
  for(let i=0; i<n_med_circles; i++) {

    let make_xyr=()=>[...distribute(weighted_random(3))
        .map(a=>(a*70+weighted_random(3, 10, 20)).toFixed(2)),
        weighted_random(1/3, 20, 35).toFixed(2)]

    const [x,y,r]=ensure_no_overlap(make_xyr, med_circles, 0.85)
    circles.push(create_circle_dom(x+"vh", 100-y+"vh", r+"vh", make_med_color()))
  }
  
  for(let i=0; i<n_small_bois; i++) {

    let make_xyr=()=>[...distribute(Math.random())
      .map(a=>(a*90+weighted_random(3, -15, 15)).toFixed(2)),
      weighted_random(1/5, 5, 20).toFixed(2)]

    const [x,y,r]=ensure_no_overlap(make_xyr, small_bois, 0.55)
    circles.push(create_circle_dom(x+"vh", 100-y+"vh", r+"vh", make_light_color()))
  }
  
  return circles
}
