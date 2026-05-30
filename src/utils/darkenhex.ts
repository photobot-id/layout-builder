const darkenHex = (hex: string, targetLightness = 20) => {
  let c = hex.replace("#", "");
  let r = parseInt(c.substring(0, 2), 16) / 255;
  let g = parseInt(c.substring(2, 4), 16) / 255;
  let b = parseInt(c.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Set a dark ceiling (e.g., 25% lightness)
  l = targetLightness / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;
  r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
    .toString(16)
    .padStart(2, "0");
  g = Math.round(hue2rgb(p, q, h) * 255)
    .toString(16)
    .padStart(2, "0");
  b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b}`;
};