export type HSLColor = {
	/** 0-1 */
	h: number
	/** 0-1 */
	s: number
	/** 0-1 */
	l: number
}

export type CMYKColor = {
	/** 0-1 */
	c: number
	/** 0-1 */
	m: number
	/** 0-1 */
	y: number
	/** 0-1 */
	k: number
}

export type HWBColor = {
	/** 0-1 */
	h: number
	/** 0-1 */
	w: number
	/** 0-1 */
	b: number
}

export type RGBColor = {
	/** 0-1 */
	r: number
	/** 0-1 */
	g: number
	/** 0-1 */
	b: number
}

export type HSVColor = {
	/** 0-1 */
	h: number
	/** 0-1 */
	s: number
	/** 0-1 */
	v: number
}

export type HEXColor = `#${string}`

export function is_color_valid(hex: string): boolean {
	return /^#[0-9a-fA-F]{6}$/i.test(hex)
}

export function hex_to_hwb(hex: HEXColor): HWBColor {
	return rgb_to_hwb(hex_to_rgb(hex))
}

export function hwb_to_hex(hwb: HWBColor): HEXColor {
	return rgb_to_hex(hwb_to_rgb(hwb))
}

export function hwb_to_rgb(hwb: HWBColor): RGBColor {
	let h = hwb.h * 6
	let w = hwb.w
	let blackness = hwb.b
	let v = 1 - blackness
	let i = Math.floor(h)
	let f = h - i
	if (i & 1) f = 1 - f

	let n = w + f * (v - w)
	let [r, g, b] = [0, 0, 0]

	if (i == 0) [r, g, b] = [v, n, w]
	else if (i == 1) [r, g, b] = [n, v, w]
	else if (i == 2) [r, g, b] = [w, v, n]
	else if (i == 3) [r, g, b] = [w, n, v]
	else if (i == 4) [r, g, b] = [n, w, v]
	else if (i == 5) [r, g, b] = [v, w, n]

	return {r, g, b}
}

export function rgb_to_hwb(rgb: RGBColor): HWBColor {
	const red = rgb.r
	const green = rgb.g
	const blue = rgb.b
	const w = Math.min(red, green, blue)
	const v = Math.max(red, green, blue)
	const b = 1 - v
	if (v == w) return {h: 0, w, b}

	const f = red == w
		? green - blue
		: ((green == w)? blue - red : red - green)
	const i = Math.floor(red == w
		? 3
		: ((green == w)? 5 : 1))
	const h = (i - f / (v - w)) / 6
	return {h, w, b}
}

export function hsv_to_hwb(hsv: HSVColor): HWBColor {
	const h = hsv.h
	const w = (1 - hsv.s) * hsv.v
	const b = 1 - hsv.v
	return {h, w, b}
}

export function hwb_to_hsv(hwb: HWBColor): HSVColor {
	const h = hwb.h
	const s = 1 - (hwb.w / (1 - hwb.b))
	const v = 1 - hwb.b
	return {h, s, v}
}

export function hsl_to_hwb(hsl: HSLColor): HWBColor {
	return {...hsv_to_hwb(hsl_to_hsv(hsl)), h: hsl.h}
}

export function hwb_to_hsl(hwb: HWBColor): HSLColor {
	return {...hsv_to_hsl(hwb_to_hsv(hwb)), h: hwb.h}
}

export function hsl_to_cmyk(hsl: HSLColor): CMYKColor {
	return rgb_to_cmyk(hsl_to_rgb(hsl))
}

export function cmyk_to_hsl(cmyk: CMYKColor): HSLColor {
	return rgb_to_hsl(cmyk_to_rgb(cmyk))
}

export function hex_to_cmyk(hex: HEXColor): CMYKColor {
	return rgb_to_cmyk(hex_to_rgb(hex))
}

export function cmyk_to_hex(cmyk: CMYKColor): HEXColor {
	return rgb_to_hex(cmyk_to_rgb(cmyk))
}

export function cmyk_to_rgb(cmyk: CMYKColor): RGBColor {
	const r = (1 - cmyk.c) * (1 - cmyk.k)
	const g = (1 - cmyk.m) * (1 - cmyk.k)
	const b = (1 - cmyk.y) * (1 - cmyk.k)
	return {r, g, b}
}

export function rgb_to_cmyk(rgb: RGBColor): CMYKColor {
	const r = rgb.r
	const g = rgb.g
	const b = rgb.b

	if (r == 0 && g == 0 && b == 0) return {
		c: 0, m: 0, y: 0, k: 1
	}

	let c = 1 - r
	let m = 1 - g
	let y = 1 - b
	let k = Math.min(c, m, y)

	c = (c - k) / (1 - k)
	m = (m - k) / (1 - k)
	y = (y - k) / (1 - k)

	return {c, m, y, k}
}

export function hex_to_hsl(hex: HEXColor): HSLColor {
	return rgb_to_hsl(hex_to_rgb(hex))
}

export function rgb_to_hsl(rgb: RGBColor): HSLColor {
	let h = 0, s = 0, l = 0
	const r = rgb.r
	const g = rgb.g
	const b = rgb.b

	const min = Math.min(r, g, b)
	const max = Math.max(r, g, b)
	const delta = max - min

	l = (max + min) / 2

	if (delta == 0) {
		h = 0
		s = 0
		return {h, s, l}
	}

	if (l < 0.5) s = delta / (max + min)
	else s = delta / (2 - max - min)

	const delta_r = (((max - r) / 6) + (delta / 2)) / delta
	const delta_g = (((max - g) / 6) + (delta / 2)) / delta
	const delta_b = (((max - b) / 6) + (delta / 2)) / delta

	if (r == max) h = delta_b - delta_g
	else if (g == max) h = (1 / 3) + delta_r - delta_b
	else if (b == max) h = (2 / 3) + delta_g - delta_r

	if (h < 0) h += 1
	if (h > 1) h -= 1

	return {h, s, l}
}

export function hex_to_rgb(hex: HEXColor): RGBColor {
	if (!is_color_valid(hex)) {
		throw new Error("Invalid hex color format!")
	}

	hex = hex.startsWith('#') ? hex.slice(1) : hex as any

	const r = Number.parseInt(hex.substring(0, 2), 16) / 0xff
	const g = Number.parseInt(hex.substring(2, 4), 16) / 0xff
	const b = Number.parseInt(hex.substring(4, 6), 16) / 0xff
	return { r, g, b }
}

export function hsl_to_rgb(hsl: HSLColor): RGBColor {
	let r, g, b

	function get_rgb_value(v1: number, v2: number, vH: number): number {
		while (vH < 0) vH += 1
		while (vH > 1) vH -= 1

		if (6 * vH < 1) return v1 + (v2 - v1) * 6 * vH
		if (2 * vH < 1) return v2
		if (3 * vH < 2) return v1 + (v2 - v1) * (2 / 3 - vH) * 6
		return v1
	}

	if (hsl.s == 0) r = g = b = hsl.l
	else {
		const v2 = hsl.l < 0.5
			? hsl.l * (1 + hsl.s)
			: hsl.l + hsl.s - hsl.s * hsl.l
		const v1 = 2 * hsl.l - v2

		r = get_rgb_value(v1, v2, hsl.h + 1 / 3)
		g = get_rgb_value(v1, v2, hsl.h)
		b = get_rgb_value(v1, v2, hsl.h - 1 / 3)
	}

	return {r, g, b}
}

export function hsl_to_hex(hsl: HSLColor): HEXColor {
	return rgb_to_hex(hsl_to_rgb(hsl))
}

export function rgb_to_hex(rgb: RGBColor): HEXColor {
	return ('#'
		+ Math.round(rgb.r * 0xff).toString(16).padStart(2, '0')
		+ Math.round(rgb.g * 0xff).toString(16).padStart(2, '0')
		+ Math.round(rgb.b * 0xff).toString(16).padStart(2, '0')
	) as HEXColor
}

export function hsv_to_hex(hsv: HSVColor): HEXColor {
	return rgb_to_hex(hsv_to_rgb(hsv))
}

export function hex_to_hsv(hex: HEXColor): HSVColor {
	return rgb_to_hsv(hex_to_rgb(hex))
}

export function rgb_to_hsv(rgb: RGBColor): HSVColor {
	let h: number = 0
	let s: number = 0
	let v: number = 0

	const r = rgb.r
	const g = rgb.g
	const b = rgb.b

	const min = Math.min(r, g, b)
	const max = Math.max(r, g, b)
	const delta = max - min

	v = max

	if (delta == 0) {
		s = 0
		h = 0
		return {h, s, v}
	}

	s = delta / max

	const delta_r = (((max - r) / 6) + (delta / 2)) / delta
	const delta_g = (((max - g) / 6) + (delta / 2)) / delta
	const delta_b = (((max - b) / 6) + (delta / 2)) / delta

	if (r == max) h = delta_b - delta_g
	else if (g == max) h = (1 / 3) + delta_r - delta_b
	else if (b == max) h = (2 / 3) + delta_g - delta_r

	if (h < 0) h += 1
	if (h > 1) h -= 1

	return {h, s, v}
}

export function hsv_to_rgb(hsv: HSVColor): RGBColor {
	let r, g, b

	if (hsv.s == 0) {
		r = g = b = hsv.v
		return {r, g, b}
	}

	let h = hsv.h * 6
	if (h == 6) h = 0

	const i = Math.floor(h)
	const j = hsv.v * (1 - hsv.s)
	const k = hsv.v * (1 - hsv.s * (h - i))
	const l = hsv.v * (1 - hsv.s * (1 - (h - i)))

	if (i == 0) [r, g, b] = [hsv.v, l, j]
	else if (i == 1) [r, g, b] = [k, hsv.v, j]
	else if (i == 2) [r, g, b] = [j, hsv.v, l]
	else if (i == 3) [r, g, b] = [j, k, hsv.v]
	else if (i == 4) [r, g, b] = [l, j, hsv.v]
	else [r, g, b] = [hsv.v, j, k]

	return {r, g, b}
}

export function hsl_to_hsv(hsl: HSLColor): HSVColor {
	const h = hsl.h
	const v = hsl.l + (hsl.s * Math.min(hsl.l, 1 - hsl.l))
	const s = v == 0
		? 0
		: (2 * (1 - (hsl.l / v)))
	return {h, s, v}
}

export function hsv_to_hsl(hsv: HSVColor): HSLColor {
	const h = hsv.h
	const l = hsv.v * (1 - (hsv.s / 2))
	const s = l == 0 || l == 1
		? 0
		: ((hsv.v - l) / Math.min(l, 1-l))
	return { h, s, l }
}
