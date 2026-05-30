import { getColors } from "react-native-image-colors";
import theme from "@constants/theme";
import { createMaterial3Theme } from "@pchmn/expo-material3-theme";


export async function parseColor(url: string) {
  const imageColor = await getColors(url, {
    fallback: theme.colors.primary,
    key: url,
    cache: false,
  });
  if (imageColor.platform === "web") {
    return {
      dominant: imageColor.dominant,
      vibrant: imageColor.vibrant,
      darkVibrant: imageColor.darkVibrant,
      lightVibrant: imageColor.lightVibrant,
      darkMuted: imageColor.darkMuted,
      lightMuted: imageColor.lightMuted,
      muted: imageColor.muted,
    }
  } else {
    return {
      dominant: "",
      vibrant: "",
      darkVibrant: "",
      lightVibrant: "",
      darkMuted: "",
      lightMuted: "",
      muted: ""
    }
  }
}

export function generateTheme(color: string, isDark: boolean) {
  const newColorTheme = createMaterial3Theme(color, {
    colorFidelity: false,
  });
  return newColorTheme[isDark ? "dark" : "light"];
}
