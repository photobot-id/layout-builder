import { StyleSheet, useWindowDimensions, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import Main, { MainProps } from "src";
import { useEffect, useState } from "react";
import theme from "@constants/theme";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { generateTheme, parseColor } from "@utils/prepare-theme";

type MessageProps = {
  source: string; 
  page: MainProps["page"];
  config: Omit<MainProps, "page"> & {
    themeColors: MD3Colors;
    useDarkTheme: boolean;
  };
  color?: string;
  initialFetch?:boolean;
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const [configs, setConfigs] = useState<MainProps>();
  const [useDarkTheme, setUseDarkTheme] = useState<boolean>(false);
  const [themeColors, setThemeColor] = useState<MD3Colors>(theme.colors);
  useEffect(() => {
    const handleMessage = async (e: MessageEvent<MessageProps>) => {
      if (e.data.source === "layout-builder-page") {
        setConfigs({page: e.data.page, ...e.data.config});
        setUseDarkTheme(e.data.config.useDarkTheme);
        setThemeColor(e.data.config.themeColors);
        if (e.data.initialFetch) {
          window.parent.postMessage({ source: "updated-parsed-color", colors: await parseColor(e.data.config.previewScreenBackground) }, "https://www.photobot.id/");
        }
      }
      if (e.data.source === "generate-theme" && e.data.color) {
        const themeColors = generateTheme(e.data.color, e.data.config.useDarkTheme);
        setThemeColor(themeColors);
        window.parent.postMessage({ source: "updated-theme", themeColors }, "https://www.photobot.id/");
      }
      if (e.data.source === "reload") {
        window.location.reload();
      }
      if (e.data.source === "update-preview-scene-background") {
        const colors = await parseColor(e.data.config.previewScreenBackground);
        const themeColors = generateTheme(colors.dominant, e.data.config.useDarkTheme);
        setConfigs({page: e.data.page, ...e.data.config});
        setThemeColor(themeColors);
        window.parent.postMessage({ source: "updated-preview-scene-background", colors, themeColors }, "https://www.photobot.id/");
      }
    };
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ source: "layout-builder", status: "ready" }, "https://www.photobot.id/");
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return configs ? (
    <PaperProvider theme={{...theme, dark: useDarkTheme,  colors: themeColors}}>
      <View style={[styles.container, { width: width, height: height }]}>
        <Main {...configs as MainProps} />
      </View>
    </PaperProvider>
  ): (<View></View>);
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
