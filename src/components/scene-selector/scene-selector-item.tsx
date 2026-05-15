import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { PropsWithChildren } from "react";
import { useAssets } from "expo-asset";
import { ImageSourcePropType } from "react-native";

type Props = {
  height?: number;
  isLandscape?: boolean;
  frame: string;
};

const SceneSelectorItem: React.FC<PropsWithChildren<Props>> = ({
  height = 200,
  isLandscape = false,
  ...props
}) => {
  const [assets] = useAssets([
    require("@assets/images/scene-default-landscape.png"),
    require("@assets/images/scene-default.png"),
  ]);

  if (!assets) {
    return null; // or <ActivityIndicator />
  }
  
  return (
    <Pressable
      style={[styles.container, { height: height, borderRadius: 0.1 * height }]}
    >
      {/* LAYER 1: The Background Thumbnail */}
      <View style={[styles.overlayContainer]}>
        <View
          style={[
            styles.showcaseWrapper,
            {
              aspectRatio: isLandscape ? 3 / 2 : 2 / 3,
              borderRadius: 0.1 * height,
            },
          ]}
        >
          <Image
            source={(isLandscape ? assets[0] : assets[1]) as ImageSourcePropType}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>
      </View>
      {/* LAYER 2: The Overlay (Frame and Blur) */}
      <View style={styles.overlayContainer}>
        <View
          style={[
            styles.showcaseWrapper,
            {
              aspectRatio: isLandscape ? 3 / 2 : 2 / 3,
              borderRadius: 0.1 * height,
            },
          ]}
        >
          <Image
            source={{uri: props.frame}}
            style={[
              styles.showcaseFrame,
              {
                aspectRatio: isLandscape ? 3 / 2 : 2 / 3,
                borderRadius: 0.1 * height,
              },
            ]}
            resizeMode="cover"
          />
          <View style={StyleSheet.absoluteFill}>{props.children}</View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  thumbnail: {
    height: "100%",
    width: "100%",
    aspectRatio: 2 / 3,
    resizeMode: "cover",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  showcaseWrapper: {
    height: "100%", // Matches the height of the parent Pressable
    overflow: "hidden",
  },
  showcaseFrame: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
});

export default SceneSelectorItem;
