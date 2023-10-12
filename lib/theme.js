import { hex_to_rgb, rgb_to_hex, rgb_to_hsl, hsl_to_rgb } from "./color.js"
import { weighted_random, skewed_random } from "./random.js"

const base_colors = ["3d87ff", "ff3d3d", "3dff87", "3dffcf", "3d5dff"]

let theme;
export const get_theme=()=>"#"+theme
export function navigate(link) {
  localStorage.preserveTheme = theme;
  window.location.href = link
}

if ("preserveTheme" in localStorage) {
  theme = localStorage.preserveTheme
  localStorage.removeItem("preserveTheme")
}
if (!theme)
  theme = base_colors[base_colors.length * Math.random() | 0];

//theme as hsl for use in other stuff because it should already exist by now
const [h,s,l]=rgb_to_hsl(...hex_to_rgb(theme));

//s goes between 100 and l, l goes between l and 10
export const make_dark_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  l+(1-l)*0.6*skewed_random(2),
  skewed_random(2, l, 0.1)))
//l goes from l to 75, s goes between s and 50
export const make_med_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  skewed_random(3/2, 0.5, s),
  skewed_random(3/2, l, 0.75)))
//
export const make_light_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  skewed_random(2/3, 0.5, s),
  skewed_random(2/3, l, 0.96)))
//even lighter than light color
export const make_background_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  skewed_random(1/2, 0.96, 1),
  skewed_random(1, 0.96, 0.87)))
export const make_dark_color_less_variance=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  l+(1-l)*0.3*weighted_random(1/5),
  skewed_random(1/5, 0.1, l)*0.6))
export const make_light_color_less_variance=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  skewed_random(1/5, 0.5, s),
  skewed_random(1/5, l, 0.96)*0.9))


//sidebar stuff
export const make_darker_background_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.95, 1.05) % 360,
  weighted_random(1/2, 0.3, 0.36),
  weighted_random(1/2, 0.13, 0.19)))
export const make_darkest_background_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.98, 1.03) % 360,
  weighted_random(1/2, 0.33, 0.39),
  weighted_random(1/2, 0.09, 0.15)))
export const make_even_darker_background_color=()=>"#"+rgb_to_hex(...hsl_to_rgb(
  h*weighted_random(2, 0.98, 1.03) % 360,
  weighted_random(1/2, 0.12, 0.16),
  weighted_random(1/2, 0.06, 0.12)))

