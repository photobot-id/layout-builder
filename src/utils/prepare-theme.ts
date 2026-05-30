import { getColors } from "react-native-image-colors";
import theme from "@constants/theme";
import { createMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3LightTheme, MD3Theme } from "react-native-paper";
import tinycolor from "tinycolor2";
import { Platform } from "react-native";


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
  if (color === theme.colors.primary) {
    return theme.colors
  } else {
    const newColorTheme = createMaterial3Theme(color, {
      colorFidelity: false,
    });
    return newColorTheme[isDark ? "dark" : "light"];
  }
}

// export type PreparationSuccess = {
//   theme: MD3Theme;
//   darkLogo: boolean;
//   eventDetails: EventDetails;
// };

// export type PreparationError = {
//   message: string;
// };

// const isWeb = Platform.OS === "web";

// export async function prepareTheme(
//   event: EventDetails,
// ): Promise<CallbackResult<PreparationSuccess, PreparationError>> {
//   try {
//     let backgrundFile, frameFile, showcaseFrameFile, backgroundFileLandscape, frameFileLandscape, showcaseFrameFileLandscape;
//     const destinationBG = new Directory(Paths.document, "scenebackground");
//     const destinationFrame = new Directory(Paths.document, "sceneframe");
//     const destinationShowcaseFrame = new Directory(Paths.document, "showcaseFrame");
//     if (!destinationBG.exists) {
//       destinationBG.create();
//     }
//     if (!destinationFrame.exists) {
//       destinationFrame.create();
//     }
//     if (!destinationShowcaseFrame.exists) {
//       destinationShowcaseFrame.create();
//     }

//     if (event.background) {
//       backgrundFile = await File.downloadFileAsync(
//         event.background,
//         destinationBG,
//         { idempotent: true },
//       );
//     }

//     if (event.frame) {
//       frameFile = await File.downloadFileAsync(
//         event.frame,
//         destinationFrame,
//         { idempotent: true },
//       );
//     }
//     if (event.showcaseFrame) {
//       showcaseFrameFile = await File.downloadFileAsync(
//         event.showcaseFrame,
//         destinationShowcaseFrame,
//         { idempotent: true },
//       );
//     }

//     if (!backgrundFile) {
//       return {success: false,
//       error: {
//         message: "background Error",
//       },}
//     }
//     const imageColor = await getColors(backgrundFile.uri, {
//       fallback: theme.colors.primary,
//       key: backgrundFile.uri,
//       cache: false,
//     });
//     let newPrimaryColor = theme.colors.primary;
//     let useDarkLogo = false;
//     if (imageColor.platform === "android") {
//       useDarkLogo = tinycolor(imageColor.dominant).isDark();
//       newPrimaryColor = makeSeedColorContrastSafe(
//         useDarkLogo ? imageColor.darkVibrant : imageColor.lightVibrant,
//         imageColor.dominant,
//       );
//     }
//     const newColorTheme = createMaterial3Theme(newPrimaryColor, {
//       colorFidelity: false,
//     });
//     const newTheme = {
//       ...MD3LightTheme,
//       colors: newColorTheme.light,
//     };
//     const newEventDetails = {
//       ...event,
//       background: backgrundFile?.uri,
//       frame: frameFile?.uri,
//       showcaseFrame: showcaseFrameFile?.uri
//     };
//     return {
//       success: true,
//       data: {
//         theme: newTheme,
//         darkLogo: useDarkLogo,
//         eventDetails: newEventDetails as EventDetails,
//       },
//     };
//   } catch (error: any) {
//     console.error(error);
//     return {
//       success: false,
//       error: {
//         message: error.error,
//       },
//     };
//   }
// }

function makeSeedColorContrastSafe(baseColor: string, imageBaseColor: string) {
  const backgroundIsDark = tinycolor(imageBaseColor).isDark();
  let seed = tinycolor(baseColor);
  // avoid gray / dull themes
  if (seed.toHsl().s < 0.2) {
    seed = seed.saturate(30);
  }

  if (backgroundIsDark) {
    seed = seed.lighten(25);
  } else {
    seed = seed.darken(25);
  }

  return seed.toHexString();
}
