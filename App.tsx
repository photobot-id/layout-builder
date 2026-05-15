import { StatusBar } from "expo-status-bar";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { MD3Theme, PaperProvider } from "react-native-paper";
import theme from "./src/constants/theme";
import Main, { LayoutProps } from "src";

export default function App() {
  const data: LayoutProps & {
    theme: MD3Theme
  } = {
    orientation: "LANDSCAPE",
    selectorType: "VERTICAL",
    position: "CENTER",
    size: "MEDIUM",
    background:
      "https://static.wixstatic.com/media/a95a81_b85303261e484d3d83cedef2d6f62857~mv2.png",
    theme: theme,
    darkLogo: false,
    frame:
      "https://static.wixstatic.com/media/a95a81_b1e0a48d41314469a0c048c290f19933~mv2.png",
  };
  const { width, height } = useWindowDimensions();
  return (
    <PaperProvider theme={data.theme}>
      <StatusBar hidden={true} />
      <View style={[styles.container, { width: width, height: height }]}>
        <Main {...data} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
