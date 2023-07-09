//all this code is basically just converted from lua
//from my lua color library becuase I can't be bothered
//to write all that again
export function hex_to_rgb(hex) {
  let n=parseInt(hex, 16)
  return [n>>16,n>>8&255,n&255]
}

export function rgb_to_hex(r, g, b) {
  return (1<<24|r<<16|g<<8|b).toString(16).slice(1)
}

export function rgb_to_hsl(r, g, b) {
	let R=r/255, G=g/255, B=b/255

	let max=Math.max(R, G, B), min=Math.min(R, G, B)
	let l, s, h

	// Get luminance
	l = (max + min) / 2

	// short circuit saturation and hue if it's grey to prevent divide by 0
	if (max == min) { return 0, 0, l }

	// Get saturation
	if (l <= 0.5) s = (max - min) / (max + min)
	else s = (max - min) / (2 - max - min)

	// Get hue
	if (max == R) h = (G - B) / (max - min) * 60
	else if (max == G) h = (2.0 + (B - R) / (max - min)) * 60
	else h = (4.0 + (R - G) / (max - min)) * 60

	// Make sure it goes around if it's negative (hue is a circle)
	if (h != 360) h = h % 360
	if (h < 0) h = 360 + h

	return [h, s, l]
}

export function hsl_to_rgb(h, s, l) {
	let temp1, temp2, temp_r, temp_g, temp_b, temp_h

	// Set the temp variables
	if (l <= 0.5) temp1 = l * (s + 1)
	else temp1 = l + s - l * s

	temp2 = l * 2 - temp1

	temp_h = h / 360

	temp_r = temp_h + 1/3
	temp_g = temp_h
	temp_b = temp_h - 1/3

	// Make sure it's between 0 and 1
	if (temp_r != 1) temp_r = temp_r % 1
	if (temp_r < 0) temp_r = 1 + temp_r
	if (temp_g != 1) temp_g = temp_g % 1
	if (temp_g < 0) temp_g = 1 + temp_g
	if (temp_b != 1) temp_b = temp_b % 1
	if (temp_b < 0) temp_b = 1 + temp_b

	let rgb = [0, 0, 0]

	// Bunch of tests
	// Once again I haven't the foggiest what any of this does
  for (const [i, temp_col] of [temp_r, temp_g, temp_b].entries()) {
		if (temp_col * 6 < 1) rgb[i] = temp2 + (temp1 - temp2) * temp_col * 6
		else if (temp_col * 2 < 1) rgb[i] = temp1
		else if (temp_col * 3 < 2) rgb[i] = temp2 + (temp1 - temp2) * (2/3 - temp_col) * 6
		else rgb[i] = temp2
  }

	return [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255)]
}

