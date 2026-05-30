import SceneSelector, { SelectorProps } from "@components/scene-selector";
import { Image, StyleSheet, useWindowDimensions, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import Preview, { PreviewProps } from "./preview";
import { BlurView } from "expo-blur";

export type MainAndPreviewProps = {
  page: "PREVIEW" | "MAIN";
  orientation: "PORTRAIT" | "LANDSCAPE";
  appLogo: string;
  displayLogo: boolean;
  // preview screen and blur
  previewScreenBackground: string;
  useBlurOnPreviewScreen: boolean;
  blurIntensity: number;
  blurType: "dark" | "light";
};
export type MainProps = MainAndPreviewProps & {
  // main screen
  sceneSelector: SelectorProps;
  backgroundType: "VIDEO" | "IMAGE";
  background: string;
} & Omit<PreviewProps, "orientation">;

export default function Main(props: MainProps) {
  const { width, height } = useWindowDimensions();
  const containerHeight = props.orientation === "LANDSCAPE" ? 1080 : 1980;
  const containerWidth = props.orientation === "LANDSCAPE" ? 1980 : 1080;

  const getScale = () => {
    let scl = 1;
    if (props.orientation === "PORTRAIT") {
      scl =  (height - height * 0.1) / containerHeight;
      if (width < (containerWidth*scl)) {
        scl = (width - width * 0.1) / containerWidth;
      }
    } else {
      scl =  (width - width * 0.2) / containerWidth;
      if (height < (containerHeight*scl)) {
        scl = (height - height * 0.1) / containerHeight;
      }
    }
    return scl;
  }
  const scale = getScale();
  const player = useVideoPlayer(
    props.backgroundType === "VIDEO" ? props.background : null,
    (playerInstance) => {
      playerInstance.loop = true;
      playerInstance.muted = true; // Background videos should usually be silent
      playerInstance.play();
    },
  );
  useEffect(() => {
    if (player && props.backgroundType === "VIDEO") {
      player.muted = true; // Double-insure it's muted before firing
      player.play();
    }
  }, [player, props.backgroundType]);
  return (
    <View
      style={[
        styles.container,
        {
          height: containerHeight,
          width: containerWidth,
          transform: [{ scale: scale }],
        },
      ]}
    >
      {props.page === "MAIN" ? (
        <>
          {props.backgroundType === "VIDEO" ? (
            <VideoView
              player={player}
              style={styles.bg}
              contentFit="cover"
              nativeControls={false}
              showsTimecodes={false}
            />
          ) : (
            <Image
              source={{ uri: props.background }}
              style={styles.bg}
              resizeMode="cover"
            />
          )}
        </>
      ) : (
        <Image
          source={{ uri: props.previewScreenBackground }}
          style={styles.bg}
          resizeMode="cover"
        />
      )}
      {props.page === "PREVIEW" && props.useBlurOnPreviewScreen && (
        <BlurView
          intensity={props.blurIntensity}
          tint={props.blurType}
          style={StyleSheet.absoluteFill}
        />
      )}
      {props.displayLogo && (
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: props.appLogo }}
            resizeMode="contain"
            style={{width: 150, height: 80}}
          />
        </View>
      )}
      {props.page === "MAIN" ? <SceneSelector {...props.sceneSelector} /> : <Preview {...props}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30
  }
});
