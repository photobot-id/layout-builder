import HeaderLogo from "@components/header-logo";
import SceneSelectorColumn from "@components/scene-selector/scene-selector-column";
import SceneSelectorParalax from "@components/scene-selector/scene-selector-paralax";
import SceneSelectorParalaxVertical from "@components/scene-selector/scene-selector-paralax-vertical";
import { ImageBackground, StyleSheet, useWindowDimensions, View } from "react-native";
import { SceneSelectorProp } from "types/scene";

export type LayoutProps = {
  orientation: "PORTRAIT" | "LANDSCAPE";
  selectorType: "2COLUMN" | "VERTICAL" | "HORIZONTAL" | "WALL";
  position: "LEFT" | "RIGHT" | "CENTER" | "BOTTOM";
  size: "LARGE" | "SMALL" | "MEDIUM";
  background:string;
  darkLogo: boolean,
  frame: string,
};

const scenes: SceneSelectorProp[] = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
  { id: "4", title: "Item 4" },
];

export default function Main(props: LayoutProps) {
  const { width, height } = useWindowDimensions();
  const containerHeight = props.orientation === "LANDSCAPE" ? 1080 : 1980;
  const containerWidth = props.orientation === "LANDSCAPE" ? 1980 : 1080;
  const scale = props.orientation === "LANDSCAPE" ? ((width - (width * 0.2)) / containerWidth) : ((height - (height * 0.1)) / containerHeight);
  console.log(scale);
  return (
    <View style={[styles.container, {height: containerHeight, width: containerWidth, transform: [{scale: scale}]}]}>
      <ImageBackground
        source={props.background ? { uri: props.background } : undefined}
        resizeMode="cover"
        style={styles.bg}
      >
        <HeaderLogo darkLogo={props.darkLogo} />
        {/* <SceneSelectorColumn scenes={scenes} frame={props.frame}/> */}
        {/* <SceneSelectorParalaxVertical frame={props.frame} scenes={scenes} size="MEDIUM" orientation="RIGHT" position="CENTER"/> */}
        <SceneSelectorParalax
          frame={props.frame}
          scenes={scenes}
          size="SMALL"
          position="BOTTOM"
        />
        {/* <ScenerSelectorStack scenes={scenes} frame={props.frame}/> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  bg: {
    height: "100%",
    width: "100%",
  },
});
